// server/models/Bill.js

const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'completed', 'failed'],
    default: 'uploaded',
  },
  extractedText: {
    type: String,
  },
  aiSummary: {
    type: String,
  },
  structuredData: {
    totalCost: Number,
    unitsUsed: String,
    dueDate: Date,
    baseCharge: Number,
    taxesAndFees: Number,
    otherCharges: Number,
  },
  // New field for anomaly detection results
  anomalyData: {
    isAnomaly: { type: Boolean, default: false },
    message: { type: String, default: '' },
  },
  language: {
    type: String,
    default: 'English',
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bill', BillSchema);
