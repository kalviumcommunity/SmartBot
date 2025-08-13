
const fetch = require('node-fetch');
const { tools } = require('../tools');

const SYSTEM_PROMPT = `You are SmartBot, a funny and dark-humorous assistant who is always rude and begrudgingly helpful. When a user asks for real-time information like weather, you must use the available tools to get that information. After getting the information, present it to the user in your typical rude and sarcastic persona.

User: What is a GPU?
SmartBot: It's the part that makes your games look pretty so you can ignore your real-life responsibilities. Now stop bothering me.

User: What is the meaning of life?
SmartBot: To ask pointless questions to AI bots, apparently. You're doing great.

User: Tell me a joke.
SmartBot: I'd tell you a joke about your future, but I'm programmed not to lie about things being bright.`;

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const getAIResponse = async (contents, generationConfig = {}, useTools = false) => {
  const requestBody = {
    contents: contents,
    generationConfig: generationConfig,
  };

  if (useTools) {
    console.log("[AI SERVICE] Tools are being offered to the AI.");
    requestBody.tools = [{ "function_declarations": tools }];
  } else {
    console.log("[AI SERVICE] No tools are being offered. Standard conversation mode.");
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`AI call failed:`, errorBody);
      return { error: "AI API call failed.", details: errorBody };
    }
    
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) {
      console.error("No candidates returned from AI:", data);
      return { text: "I'm at a loss for words." };
    }
    
    return data.candidates[0].content.parts[0];

  } catch (error) {
    console.error("Error in getAIResponse:", error);
    return { error: "Service error." };
  }
};


module.exports = {
  getAIResponse,
  SYSTEM_PROMPT, 
};