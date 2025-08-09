// server/controllers/ttsController.js
const axios = require('axios');

const speakSummary = async (req, res) => {
  const { text } = req.body;

  // --> 1. Get credentials securely from environment variables
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;

  if (!apiKey || !voiceId) {
    console.error('TTS API key or Voice ID is not configured on the server.');
    return res.status(500).json({ message: 'Server configuration error.' });
  }

  if (!text) {
    return res.status(400).json({ message: 'No text provided for audio generation.' });
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;

  try {
    const response = await axios({
      method: 'post',
      url: url,
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
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
    // --> 2. Implement detailed error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`ElevenLabs API Error: Status ${error.response.status}`, error.response.data);
      // Forward the error from ElevenLabs to the client for better debugging
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('ElevenLabs API Error: No response received', error.request);
      res.status(500).json({ message: 'Failed to communicate with TTS service.' });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('ElevenLabs API Error: Request setup failed', error.message);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
};

module.exports = { speakSummary };