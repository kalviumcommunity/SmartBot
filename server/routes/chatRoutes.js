// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { handleChatRequest } = require('../controllers/chatController');

// Define the POST route for chat
router.post('/', handleChatRequest);

module.exports = router;