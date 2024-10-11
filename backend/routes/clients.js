import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import JobPosting from '../models/jobPosting.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get all clients with pagination, sorting, and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, email } = req.query;

    // Prepare filter
    const filter = { type: 'client' };
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (email) filter.email = { $regex: email, $options: 'i' };

    // Prepare sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const clients = await User.find(filter)
      .select('-password')  // Exclude password field
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Get total count for pagination
    const totalClients = await User.countDocuments(filter);

    res.json({
      clients,
      totalPages: Math.ceil(totalClients / limit),
      currentPage: Number(page),
      totalClients
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single client
router.get('/:id', getClient, (req, res) => {
  const clientWithoutPassword = res.client.toObject();
  delete clientWithoutPassword.password;
  res.json(clientWithoutPassword);
});

// Create a new client
router.post('/', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const client = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    type: 'client',
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a client
router.patch('/:id', getClient, async (req, res) => {
  if (req.body.name != null) {
    res.client.name = req.body.name;
  }
  if (req.body.email != null) {
    res.client.email = req.body.email;
  }
  if (req.body.password != null) {
    res.client.password = req.body.password;
  }

  try {
    const updatedClient = await res.client.save();
    const clientWithoutPassword = updatedClient.toObject();
    delete clientWithoutPassword.password;
    res.json(clientWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a client
router.delete('/:id', getClient, async (req, res) => {
  try {
    await res.client.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to get client by ID
async function getClient(req, res, next) {
  try {
    const client = await User.findOne({ _id: req.params.id, type: 'client' }).select('-password');
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
    res.client = client;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



router.get('/:id/job-posting', async (req, res) => {
  try {
    const applications = await JobPosting.find({ clientReference: req.params.id });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: err.message });
  }
})

export { router as clientsRouter };
