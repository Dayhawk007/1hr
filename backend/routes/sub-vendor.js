import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all sub-vendors
router.get('/', async (req, res) => {
  try {
    const subVendors = await User.find({ type: 'sub-vendor' });
    res.json(subVendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single sub-vendor
router.get('/:id', getSubVendor, (req, res) => {
  res.json(res.subVendor);
});

// Create a new sub-vendor
router.post('/', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const subVendor = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    type: 'sub-vendor',
  });

  try {
    const newSubVendor = await subVendor.save();
    res.status(201).json(newSubVendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a sub-vendor
router.patch('/:id', getSubVendor, async (req, res) => {
  if (req.body.name != null) {
    res.subVendor.name = req.body.name;
  }
  if (req.body.email != null) {
    res.subVendor.email = req.body.email;
  }
  if (req.body.password != null) {
    res.subVendor.password = req.body.password;
  }

  try {
    const updatedSubVendor = await res.subVendor.save();
    res.json(updatedSubVendor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a sub-vendor
router.delete('/:id', getSubVendor, async (req, res) => {
  try {
    await res.subVendor.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to get sub-vendor by ID
async function getSubVendor(req, res, next) {
  try {
    const subVendor = await User.findOne({ _id: req.params.id, type: 'sub-vendor' });
    if (subVendor == null) {
      return res.status(404).json({ message: 'Cannot find sub-vendor' });
    }
    res.subVendor = subVendor;
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export { router as subVendorsRouter };
