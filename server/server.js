// server/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/api/users');

// Import routes
const billRoutes = require('./routes/api/bills');

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the VoiceYourBill API!');
});

// --- Use API Routes ---
// Any request to '/api/bills' will be handled by our billRoutes
app.use('/api/users', userRoutes);
app.use('/api/bills', billRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});