import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import JobPosting from '../models/jobPosting.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await User.find({ type: 'client' });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single client
router.get('/:id', getClient, (req, res) => {
  res.json(res.client);
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
    res.json(updatedClient);
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
    const client = await User.findOne({ _id: req.params.id, type: 'client' });
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
