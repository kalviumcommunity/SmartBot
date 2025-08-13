// client/src/components/ChatMessage.jsx
import React from 'react';

const ChatMessage = ({ message }) => {
  const messageClass = message.sender === 'user' ? 'user' : 'bot';

  return (
    <div className={`chat-message ${messageClass}`}>
      <p style={{fontWeight: 'bold', marginBottom: '10px'}}>
        {message.sender === 'user' ? 'You' : 'SmartBot'}
      </p>
      <p style={{margin: 0}}>{message.text}</p>
    </div>
  );
};

export default ChatMessage;