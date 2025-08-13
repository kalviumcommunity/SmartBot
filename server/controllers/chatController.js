// server/controllers/chatController.js
const { getAIResponse, RUDE_BOT_PROMPT } = require('../services/aiService');
const { getWeather } = require('../tools');

const COMPARISON_PROMPT = `You are a comparison bot. Analyze the two items the user wants to compare and provide a JSON object with a "pros" and "cons" list for each.

User: Compare React and Vue
SmartBot: {
  "React": {
    "pros": ["Large ecosystem and community", "Backed by Facebook", "Great for large-scale applications"],
    "cons": ["Steeper learning curve", "Can be overly complex for simple projects"]
  },
  "Vue": {
    "pros": ["Easier to learn", "Excellent documentation", "High performance"],
    "cons": ["Smaller ecosystem than React", "Less corporate backing"]
  }
}`;


const COT_PROMPT = `When asked a question that requires multiple steps, you must first provide a step-by-step "Chain of Thought" of your reasoning. After your reasoning, provide the final answer prefixed with "Final Answer: , and on sarcastic tone ".

User: I have 5 apples. I eat 2, and then my friend gives me 3 more. How many apples do I have now?
SmartBot: Chain of Thought: The user starts with 5 apples. They eat 2, so the count is 5 - 2 = 3. Then, they receive 3 more, so the new count is 3 + 3 = 6.
Final Answer: You have 6 apples.`;

const needsTools = (message) => {
  const toolKeywords = ['weather', 'temperature', 'forecast', 'climate', 'how hot', 'how cold'];
  const lowerCaseMessage = message.toLowerCase();
  return toolKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

const isComparisonRequest = (message) => {
  const comparisonKeywords = ['vs', 'versus', 'compare', 'pros and cons', 'advantages of'];
  const lowerCaseMessage = message.toLowerCase();
  return comparisonKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};


const isReasoningRequest = (message) => {
  const reasoningKeywords = ['how many', 'what is the total', 'figure out', 'solve for', 'calculate'];
  const lowerCaseMessage = message.toLowerCase();
  return reasoningKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

const handleChatRequest = async (req, res) => {
  try {
    const { message, style } = req.body;
    if (!message) { return res.status(400).json({ error: 'Message is required' }); }

    const useTools = needsTools(message);
    const useComparison = !useTools && isComparisonRequest(message);
   
    const useCoT = !useTools && !useComparison && isReasoningRequest(message);

    let generationConfig = { stopSequences: ["User:"] };
    let contents;
    let toolsEnabled = false;

    
    if (useTools) {
      console.log("[CONTROLLER] Mode: Function Calling");
      contents = [{ role: "user", parts: [{ text: `You are a helpful assistant. Your job is to identify when a user's request requires a real-world tool.\n\nUser: ${message}` }] }];
      toolsEnabled = true;
    } else if (useComparison) {
      console.log("[CONTROLLER] Mode: Structured Output (JSON)");
      contents = [{ role: "user", parts: [{ text: `${COMPARISON_PROMPT}\n\nUser: ${message}\nSmartBot:` }] }];
      generationConfig.temperature = 0.1;
    } else if (useCoT) {
      
      console.log("[CONTROLLER] Mode: Chain of Thought");
      contents = [{ role: "user", parts: [{ text: `${COT_PROMPT}\n\nUser: ${message}\nSmartBot:` }] }];
  
      generationConfig.temperature = 0.1;
    } else {
      console.log("[CONTROLLER] Mode: Conversational");
      contents = [{ role: "user", parts: [{ text: `${RUDE_BOT_PROMPT}\n\nUser: ${message}\nSmartBot:` }] }];
      if (style === 'creative') { generationConfig.temperature = 0.9; }
      else if (style === 'topk') { generationConfig.topK = 40; }
      else if (style === 'topp') { generationConfig.topP = 0.95; }
      else { generationConfig.temperature = 0.2; }
    }

    const initialResponse = await getAIResponse(contents, generationConfig, toolsEnabled);

    if (toolsEnabled && initialResponse && initialResponse.functionCall) {
      const { name: functionName, args: functionArgs } = initialResponse.functionCall;
      console.log(`[CONTROLLER] AI wants to call function "${functionName}"`);

      let functionResult = (functionName === 'getWeather')
        ? await getWeather(functionArgs.city)
        : "Unknown function";
      console.log(`[CONTROLLER] Got function result: "${functionResult}"`);

      const newContents = [
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [initialResponse] },
        {
          role: "tool",
          parts: [{
            function_response: { name: functionName, response: { content: functionResult } }
          }]
        }
      ];

      console.log('[CONTROLLER] Sending result back to AI for final response...');
      const finalPromptContents = [
        { role: "user", parts: [{ text: `${RUDE_BOT_PROMPT}\n\nUser: ${message}` }] },
        ...newContents.slice(1)
      ];
      const finalResponse = await getAIResponse(finalPromptContents, generationConfig, false);
      
      res.status(200).json({ sender: 'bot', text: finalResponse.text });

    } else {
      console.log("[CONTROLLER] No function call needed. Returning direct response.");
      res.status(200).json({ sender: 'bot', text: initialResponse.text || "I don't have a direct answer for that." });
    }

  } catch (error) {
    console.log('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = { handleChatRequest };