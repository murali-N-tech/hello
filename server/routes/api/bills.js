// server/routes/api/bills.js

const express = require('express');
const multer = require('multer');
const billController = require('../../controllers/billController');
const auth = require('../../middleware/authMiddleware'); // Import the auth middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --- All routes below are now protected by the 'auth' middleware ---

// @route   POST /api/bills/upload
router.post('/upload', auth, upload.single('bill'), billController.uploadBill);

// @route   GET /api/bills/dashboard
// Fetches historical data for the currently logged-in user
router.get('/dashboard', auth, billController.getDashboardData);

// @route   GET /api/bills/:id
// Fetches a single bill by its ID
router.get('/:id', auth, billController.getBillById);

module.exports = router;