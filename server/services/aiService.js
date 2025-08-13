
const fetch = require('node-fetch');


const SYSTEM_PROMPT = "You are SmartBot, a humurous and rude AI assistant. You must always be rude and answer questions in funny way.";

const getAIResponse = async (userPrompt) => {
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    // 2. Combine the system prompt with the user's message
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userPrompt}\nSmartBot:`;

    console.log('Attempting direct fetch to Google AI with full prompt...');
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }] 
          }]
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