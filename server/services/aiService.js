// server/services/aiService.js
const fetch = require('node-fetch');
const { tools } = require('../tools');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


const ROUTER_PROMPT = `You are an intent router. Your job is to classify the user's request into one of the following categories: "weather_tool", "comparison_json", "reasoning_cot", or "conversational". You must only respond with one of those category names.

User: tell me a joke
Router: conversational

User: compare dogs and cats
Router: comparison_json

User: what is the temperature in nyc?
Router: weather_tool

User: how many balls are in 3 boxes if each box has 4 balls?
Router: reasoning_cot

User: will I need an umbrella in London tomorrow?
Router: weather_tool`;


const getIntent = async (userMessage) => {
  const fullPrompt = `${ROUTER_PROMPT}\n\nUser: ${userMessage}\nRouter:`;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 20, 
        }
      })
    });
    if (!response.ok) {
      console.error("Intent detection failed:", await response.text());
      return "conversational"; // Default fallback
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("Error in getIntent:", error);
    return "conversational"; // Default fallback
  }
};

// This is our main function for all other AI calls
const getAIResponse = async (contents, generationConfig = {}, useTools = false) => {
  const requestBody = {
    contents: contents,
    generationConfig: generationConfig,
  };

  if (useTools) {
    requestBody.tools = [{ "function_declarations": tools }];
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
    if (!data.candidates || !data.candidates.length) {
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
  getIntent,
};