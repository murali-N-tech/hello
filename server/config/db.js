// server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB cluster
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    // Log any errors that occur during connection
    console.error('MongoDB connection error:', error);
    // Exit the process with a failure code
    process.exit(1);
  }
};

module.exports = connectDB;