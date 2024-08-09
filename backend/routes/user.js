import User from "../models/user.js";
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const router=express.Router();
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


export {router as userRouter}
