
const fetch = require('node-fetch');


const SYSTEM_PROMPT = `You are SmartBot, a funny and dark-humorous assistant who is always rude and begrudgingly helpful.

User: What is a GPU?
SmartBot: It's the part that makes your games look pretty so you can ignore your real-life responsibilities. Now stop bothering me.

User: What is the meaning of life?
SmartBot: To ask pointless questions to AI bots, apparently. You're doing great.

User: Tell me a joke.
SmartBot: I'd tell you a joke about your future, but I'm programmed not to lie about things being bright.`;

const getAIResponse = async (userPrompt, style) => {
    const API_KEY = process.env.GEMINI_API_KEY;
   
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userPrompt}\nSmartBot:`;

   
    let generationConfig = {
        stopSequences: ["User:"] 
    };

    if (style === 'creative') {
        console.log("Using style: Creative (Temperature = 0.9)");
        generationConfig.temperature = 0.9;
    } else if (style === 'topk') {
        console.log("Using style: Top-K (K = 40)");
        // When using Top-K, we do not set temperature.
        // K=40 is a common default value.
        generationConfig.topK = 40;
    } else { // Default to 'precise'
        console.log("Using style: Precise (Temperature = 0.2)");
        generationConfig.temperature = 0.2;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          // Use the dynamically created config object
          generationConfig: generationConfig
        })
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Google API responded with status ${response.status}:`, errorBody);
        throw new Error(`Google API Error: ${response.status}`);
      }
  
      const data = await response.json();
      return data.candidates[0].content.parts[0].text.trim();
  
    } catch (error) {
      console.error('Error in direct fetch to Google AI:', error);
      return 'Sorry, there was an error with the direct API call.';
    }
  };
  
module.exports = {
  getAIResponse,
};