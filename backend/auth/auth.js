
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

// Middleware to verify JWT token and populate user object
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware to check user type
const checkUserType = async(req, res, next) => {
  if(req.user && req.user.type === req.body.type) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export { auth, checkUserType, hashPassword, comparePassword };

