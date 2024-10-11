import User from "../models/user.js";
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { put } from '@vercel/blob';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// File upload route
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  try {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `resume-${uniqueSuffix}-${req.file.originalname}`;

    // Upload file to Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype
    });

    // Return the URL of the uploaded file
    res.json({ fileUrl: blob.url });
  } catch (error) {
    console.log(error.message);
    console.error('Error uploading file to Vercel Blob:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Remove this line as it's no longer needed
// router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin signup
router.post('/signup', async (req, res) => {
  try {
    if (req.body.type === 'admin') {
      return res.status(400).json({ error: 'Cannot sign up as admin' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      type: req.body.type
    });
    if(!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    else{
      
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.status(201).json({ token, user });
    
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Login for admin
router.post('/admin/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, type: 'admin' });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, type: 'admin' }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login for client
router.post('/client/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, type: 'client' });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, type: 'client' }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login for sub-vendor
router.post('/sub-vendor/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, type: 'sub-vendor' });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id, type: 'sub-vendor' }, process.env.JWT_SECRET);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const { name, email, type } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (type) user.type = type;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user password
router.patch('/update-password/:id', async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.params.id;

  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }

  try {
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export {router as userRouter}
