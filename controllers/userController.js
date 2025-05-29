require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
// Signup controller function with input validation and password complexity check and preference validation.
async function signup (req, res)  {
    const { name, email, password, preferences = [] } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Password complexity check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });

      // Validate preferences
      if (preferences.length > 10) {
        return res.status(400).json({ message: 'Maximum 10 preferences allowed' });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, preferences });
      res.status(200).json({user: { name: user.name, email: user.email, preferences: user.preferences } });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation Error',
          errors: Object.values(err.errors).map(e => e.message)
        });
      }
      res.status(500).json({ message: 'Server error during registration' });
    }
  };
// Login controller function with input validation and password comparison.
  async function login (req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
      res.json({ token, user: { name: user.name, email: user.email, preferences: user.preferences } });
    } catch (err) {
      res.status(500).json({ message: err.message });
   }
  }
// Get preferences controller function.
  async function getPreferences (req, res) {
    try {
      res.status(200).json({ preferences: req.user.preferences });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
// Update preferences controller function with input validation.
  async function updatePreferences (req, res) {
    const { preferences } = req.body;

    // Validate preferences input
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ message: 'Preferences must be an array' });
    }

    // Validate preferences length
    if (preferences.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 preferences allowed' });
    }

    // Validate each preference
    const invalidPreferences = preferences.filter(pref => 
      typeof pref !== 'string' || pref.trim().length === 0 || pref.length > 50
    );

    if (invalidPreferences.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid preferences found',
        errors: 'Each preference must be a non-empty string with maximum 50 characters'
      });
    }

    try {
      req.user.preferences = preferences.map(p => p.trim());
      await req.user.save();
      res.status(200).json({ message: 'Preferences updated' });
    } catch (err) {
      res.status(500).json({ message: 'Could not update preferences' });
    }
  }

  module.exports = { signup, login, getPreferences, updatePreferences };