
const { getAIResponse, SYSTEM_PROMPT: RUDE_BOT_PROMPT } = require('../services/aiService');
const { getWeather } = require('../tools');


const TOOL_USE_PROMPT = `You are a sarcastic assistant. Your job is to identify when a user's request requires a real-world tool and to call the appropriate function.`;

const needsTools = (message) => {
  const toolKeywords = ['weather', 'temperature', 'forecast', 'climate', 'how hot', 'how cold'];
  const lowerCaseMessage = message.toLowerCase();
  return toolKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

const handleChatRequest = async (req, res) => {
  try {
    const { message, style } = req.body;
    if (!message) { return res.status(400).json({ error: 'Message is required' }); }

    const useTools = needsTools(message);
    console.log(`[CONTROLLER] Message: "${message}". Needs tools? ${useTools}`);

    let generationConfig = { stopSequences: ["User:"] };
    if (style === 'creative') { generationConfig.temperature = 0.9; }
    else if (style === 'topk') { generationConfig.topK = 40; }
    else if (style === 'topp') { generationConfig.topP = 0.95; }
    else { generationConfig.temperature = 0.2; }

    let contents;
    
    if (useTools) {
      contents = [{ role: "user", parts: [{ text: `${TOOL_USE_PROMPT}\n\nUser: ${message}` }] }];
    } else {
     
      contents = [{ role: "user", parts: [{ text: `${RUDE_BOT_PROMPT}\n\nUser: ${message}\nSmartBot:` }] }];
    }

    const initialResponse = await getAIResponse(contents, generationConfig, useTools);

    if (useTools && initialResponse && initialResponse.functionCall) {
      const { name: functionName, args: functionArgs } = initialResponse.functionCall;
      console.log(`[CONTROLLER] AI wants to call function "${functionName}"`);

      let functionResult = (functionName === 'getWeather')
        ? await getWeather(functionArgs.city)
        : "Unknown function";
      console.log(`[CONTROLLER] Got function result: "${functionResult}"`);

      
      const newContents = [
        { role: "user", parts: [{ text: `${RUDE_BOT_PROMPT}\n\nUser: ${message}` }] },
        { role: "model", parts: [initialResponse] },
        {
          role: "tool",
          parts: [{
            function_response: { name: functionName, response: { content: functionResult } }
          }]
        }
      ];

      console.log('[CONTROLLER] Sending result back to AI for final response...');
      const finalResponse = await getAIResponse(newContents, generationConfig, false); 
      
      res.status(200).json({ sender: 'bot', text: finalResponse.text });

    } else {
      console.log("[CONTROLLER] No function call needed. Returning direct response.");
      res.status(200).json({ sender: 'bot', text: initialResponse.text || "I don't have a direct answer for that." });
    }

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = { handleChatRequest };