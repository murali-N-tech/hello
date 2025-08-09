// server/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/api/users');
const billRoutes = require('./routes/api/bills');
const ttsRoutes = require('./routes/api/tts'); // Import the new TTS routes

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the VoiceYourBill API!');
});

// --- Use API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/tts', ttsRoutes); // Add the new TTS routes to the application


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
