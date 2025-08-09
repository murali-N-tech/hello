// server/controllers/ttsController.js
const axios = require('axios');

const speakSummary = async (req, res) => {
  const { text } = req.body; // Language is handled by voice selection in ElevenLabs
  const apiKey = 'sk_8bf61db2713a4317cadee8e4a28c5c030a993fa5be1987d1';

  // A popular, high-quality voice ID from ElevenLabs
  const voiceId = '21m00Tcm4TlvDq8ikWAM'; 

  if (!apiKey) {
    return res.status(500).json({ message: 'TTS API key is not configured.' });
  }
  if (!text) {
    return res.status(400).json({ message: 'No text provided.' });
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2', // Good model for multiple languages
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      responseType: 'stream',
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    response.data.pipe(res);

  } catch (error) {
    console.error('ElevenLabs API Error:', error.message);
    res.status(500).json({ message: 'Failed to generate audio.' });
  }
};

module.exports = { speakSummary };
