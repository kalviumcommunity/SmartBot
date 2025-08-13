import React from 'react';
import ComparisonView from './ComparisonView';

// --- NEW, SMARTER PARSING FUNCTION ---
const tryParseJson = (text) => {
  try {
    // Find the start and end of the JSON object, even if it's inside a code block
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    
    // If we can't find a valid start and end, it's not JSON
    if (jsonStart === -1 || jsonEnd === -1) {
      return null;
    }

    // Extract the potential JSON string
    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    
    // Now, try to parse the extracted string
    return JSON.parse(jsonString);

  } catch (e) {
    // If parsing fails at any point, it's not valid JSON
    return null;
  }
};

const ChatMessage = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'user' : 'bot';
  const jsonData = tryParseJson(message.text);

  return (
    <div className={`chat-message ${messageClass}`}>
      <p style={{fontWeight: 'bold', marginBottom: '10px'}}>
        {message.sender === 'user' ? 'You' : 'SmartBot'}
      </p>
      
      {jsonData ? (
        // If it's valid JSON, render the ComparisonView component
        <ComparisonView data={jsonData} />
      ) : (
        // Otherwise, just render the plain text
        <p style={{margin: 0}}>{message.text}</p>
      )}
    </div>
  );
};

export default ChatMessage;