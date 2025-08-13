// server/services/aiService.js
const fetch = require('node-fetch');

const SYSTEM_PROMPT = "You are SmartBot, a funny and humorous assistant. You must always be rude and answer questions clearly and in dark humourous tone.";

const getAIResponse = async (userPrompt, style) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userPrompt}\nSmartBot:`;

    const temperature = style === 'creative' ? 0.9 : 0.2;
    console.log(`Using style: ${style}, temperature: ${temperature}`);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: temperature,
            // --- NEW: Add a stop sequence ---
            stopSequences: ["User:"]
          }
        })
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Google API responded with status ${response.status}:`, errorBody);
        throw new Error(`Google API Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
  
    } catch (error) {
      console.error('Error in direct fetch to Google AI:', error);
      return 'Sorry, there was an error with the direct API call.';
    }
  };
  
module.exports = {
  getAIResponse,
};