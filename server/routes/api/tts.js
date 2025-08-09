const express = require('express');
const router = express.Router();
const { speakSummary } = require('../../controllers/ttsController');
const auth = require('../../middleware/authMiddleware');

// @route   POST /api/tts/speak
// @desc    Converts text to speech and returns an audio stream
// @access  Private (ensures only logged-in users can use the feature)
router.post('/speak', auth, speakSummary);

module.exports = router;