// server/controllers/chatController.js
const { getAIResponse } = require('../services/aiService');

const handleChatRequest = async (req, res) => {
  try {
    // 1. Get the user's message from the request
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Received message: "${message}". Sending to AI service...`);

    // 2. Call our AI service and wait for the real response
    const aiText = await getAIResponse(message);

    // 3. Create the response object with the AI's text
    const botResponse = {
      sender: 'bot',
      text: aiText,
    };

    // 4. Send the AI's response back to the frontend
    res.status(200).json(botResponse);

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = {
  handleChatRequest,
};