const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getIsConnected } = require('../config/db');
const { UsageStats } = require('../models/DataModels');

// In-Memory Database for local mock/demo mode
const mockUsers = [];

// Seed default Admin if MongoDB is not running or empty
const seedDefaultAdmin = async () => {
  const defaultAdmin = {
    id: 'admin123',
    _id: 'admin123',
    name: 'Gov Admin',
    email: 'admin@smartagro.gov',
    password: '$2a$10$78zW31r15C0Tskd3Vw6s0e5tToxe.hX6j9K17Hk.hFvNnL2gGvH8O', // 'admin123'
    role: 'admin',
    createdAt: new Date()
  };
  mockUsers.push(defaultAdmin);

  // If MongoDB is connected, also seed default admin if it doesn't exist
  if (getIsConnected()) {
    try {
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        await User.create({
          name: 'Gov Admin',
          email: 'admin@smartagro.gov',
          password: 'admin123',
          role: 'admin'
        });
        console.log('Seeded default admin to MongoDB: admin@smartagro.gov / admin123');
      }
    } catch (err) {
      console.error('Error seeding admin user to MongoDB:', err.message);
    }
  }
};

setTimeout(seedDefaultAdmin, 2000);

const getMockUserById = (id) => {
  return mockUsers.find(u => u.id === id || u._id === id);
};

const getMockUsersList = () => {
  return mockUsers;
};

// Helper to log usage statistics
const logAction = async (userId, actionType) => {
  if (getIsConnected()) {
    try {
      await UsageStats.create({ userId, actionType });
    } catch (e) {
      console.error('Error logging stats', e);
    }
  } else {
    // In-memory usage stat
    const { mockUsageStats } = require('./adminController');
    if (mockUsageStats) {
      mockUsageStats.push({
        userId,
        actionType,
        timestamp: new Date()
      });
    }
  }
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey12345', {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
  }

  const selectedRole = role === 'admin' ? 'admin' : 'farmer';

  try {
    if (getIsConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: selectedRole
      });

      const token = signToken(user._id);
      await logAction(user._id, 'Register');

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // In-memory logic
      const userExists = mockUsers.find(u => u.email === email);
      if (userExists) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: `user_${Date.now()}`,
        _id: `user_${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: selectedRole,
        createdAt: new Date()
      };

      mockUsers.push(newUser);
      const token = signToken(newUser.id);
      await logAction(newUser.id, 'Register');

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }

  try {
    if (getIsConnected()) {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Check if role matches if provided
      if (role && user.role !== role) {
        return res.status(403).json({ success: false, error: `Unauthorized role login attempt` });
      }

      const token = signToken(user._id);
      await logAction(user._id, 'Login');

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      // In-memory logic
      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      if (role && user.role !== role) {
        return res.status(403).json({ success: false, error: `Unauthorized role login attempt` });
      }

      const token = signToken(user.id);
      await logAction(user.id, 'Login');

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMockUserById = getMockUserById;
exports.getMockUsersList = getMockUsersList;
exports.logAction = logAction;
