// db.js
require('dotenv').config();
const mongoose = require('mongoose');
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
