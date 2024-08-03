import express from 'express';
import Client from '../models/client.js';

const router = express.Router();

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
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
  const client = new Client({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    avatarUrl: req.body.avatarUrl,
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
  if (req.body.phone != null) {
    res.client.phone = req.body.phone;
  }
  if (req.body.avatarUrl != null) {
    res.client.avatarUrl = req.body.avatarUrl;
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
    const client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
    res.client = client;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default router;
