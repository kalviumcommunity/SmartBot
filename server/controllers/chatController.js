// server/controllers/chatController.js
const { getAIResponse, getIntent } = require('../services/aiService');
const { getWeather } = require('../tools');

// --- All our prompts now live here, where they are used ---
const RUDE_BOT_PROMPT = `You are SmartBot, a funny and dark-humorous assistant who is always rude and begrudgingly helpful. When a user asks for real-time information like weather, you must use the available tools to get that information. After getting the information, present it to the user in your typical rude and sarcastic persona and reply shorter.

User: What is a GPU?
SmartBot: It's the part that makes your games look pretty so you can ignore your real-life responsibilities. Now stop bothering me.

User: What is the meaning of life?
SmartBot: To ask pointless questions to AI bots, apparently. You're doing great.

User: Tell me a joke.
SmartBot: I'd tell you a joke about your future, but I'm programmed not to lie about things being bright.`;

const COMPARISON_PROMPT = `You are a comparison bot. Analyze the two items the user wants to compare and provide a JSON object with a "pros" and "cons" list for each and also sarcastically roast user.

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

const COT_PROMPT = `When asked a question that requires multiple steps, you must first provide a step-by-step "Chain of Thought" of your reasoning. After your reasoning, provide the final answer prefixed with "Final Answer:".

User: I have 5 apples. I eat 2, and then my friend gives me 3 more. How many apples do I have now?
SmartBot: Chain of Thought: The user starts with 5 apples. They eat 2, so the count is 5 - 2 = 3. Then, they receive 3 more, so the new count is 3 + 3 = 6.
Final Answer: You have 6 apples.`;

const handleChatRequest = async (req, res) => {
  try {
    // --- UPDATED: We now receive 'history' instead of 'message' ---
    const { history, style } = req.body;
    if (!history || history.length === 0) { 
      return res.status(400).json({ error: 'History is required' }); 
    }

    // The user's current message is the last one in the history array
    const currentMessage = history[history.length - 1].text;

    // The router still only needs the most recent message to determine intent
    const intent = await getIntent(currentMessage);
    console.log(`[CONTROLLER] Intent for "${currentMessage}": ${intent}`);

    let generationConfig = { stopSequences: ["User:"] };
    if (style === 'creative') { generationConfig.temperature = 0.9; }
    else if (style === 'topk') { generationConfig.topK = 40; }
    else if (style === 'topp') { generationConfig.topP = 0.95; }
    else { generationConfig.temperature = 0.2; }

    let response;

    // --- NEW: A helper function to format the entire history for the Gemini API ---
    const formatHistoryForAI = (systemPrompt, fullHistory) => {
      const formatted = fullHistory.map(msg => ({
        // Translate our 'bot' sender to the 'model' role the API expects
        role: msg.sender === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      // Prepend the system prompt to the very first message in the history
      if (formatted.length > 0) {
        const firstUserMessage = fullHistory[0].text;
        formatted[0].parts[0].text = `${systemPrompt}\n\nUser: ${firstUserMessage}`;
      }
      return formatted;
    };

    switch (intent) {
      case 'weather_tool':
        // For the initial tool check, we only need the current message
        const toolCheckContents = [{ role: "user", parts: [{ text: `You are a helpful assistant. Use tools.\n\nUser: ${currentMessage}` }] }];
        const initialResponse = await getAIResponse(toolCheckContents, { temperature: 0.1 }, true);

        if (initialResponse && initialResponse.functionCall) {
          const { name: functionName, args: functionArgs } = initialResponse.functionCall;
          const functionResult = await getWeather(functionArgs.city);
          
          // For the final answer, we provide the full history for context
          const finalContents = [
            ...formatHistoryForAI(RUDE_BOT_PROMPT, history),
            { role: "model", parts: [initialResponse] },
            { role: "tool", parts: [{ function_response: { name: functionName, response: { content: functionResult } } }] }
          ];
          const finalResponse = await getAIResponse(finalContents, generationConfig, false);
          response = { sender: 'bot', text: finalResponse.text };
        } else {
          response = { sender: 'bot', text: initialResponse.text || "I couldn't use the tool." };
        }
        break;

      case 'comparison_json':
        // Provide the full history for context
        const comparisonContents = formatHistoryForAI(COMPARISON_PROMPT, history);
        const comparisonResponse = await getAIResponse(comparisonContents, { temperature: 0.1 });
        response = { sender: 'bot', text: comparisonResponse.text };
        break;

      case 'reasoning_cot':
        // Provide the full history for context
        const cotContents = formatHistoryForAI(COT_PROMPT, history);
        const cotResponse = await getAIResponse(cotContents, { temperature: 0.1 });
        response = { sender: 'bot', text: cotResponse.text };
        break;

      case 'conversational':
      default:
        // Provide the full history for context
        const convoContents = formatHistoryForAI(RUDE_BOT_PROMPT, history);
        const convoResponse = await getAIResponse(convoContents, generationConfig);
        response = { sender: 'bot', text: convoResponse.text };
        break;
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

module.exports = { handleChatRequest };