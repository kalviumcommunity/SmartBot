// server/controllers/chatController.js
const { getAIResponse } = require('../services/aiService');

const handleChatRequest = async (req, res) => {
  try {
    // Get both message and style from the request body
    const { message, style } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Received message: "${message}", style: ${style}`);

    // Pass both to the AI service
    const aiText = await getAIResponse(message, style);

    const botResponse = {
      sender: 'bot',
      text: aiText,
    };

    res.status(200).json(botResponse);
  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = {
  handleChatRequest,
};