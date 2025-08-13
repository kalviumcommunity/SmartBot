// client/src/components/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="chat-message bot">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default TypingIndicator;