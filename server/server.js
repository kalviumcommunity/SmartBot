// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables from .env file IMMEDIATELY
dotenv.config();

// 2. Add this line to debug and confirm the key is loaded
console.log('API Key Loaded in Server:', process.env.GEMINI_API_KEY);

// Now, require other modules that might need the environment variables
const chatRoutes = require('./routes/chatRoutes');

const app = express();
// --- CHANGE THE PORT HERE ---
const PORT = process.env.PORT || 3000; // Using 5001 as the new default

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running and listening on port ${PORT}`);
});