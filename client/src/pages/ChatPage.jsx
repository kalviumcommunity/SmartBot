// client/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import MessageInput from '../components/MessageInput';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';

// Receive tuningStyle and setTuningStyle as props
const ChatPage = ({ messages, onSendMessage, tuningStyle, setTuningStyle }) => {
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (userInput) => {
    setIsTyping(true);
    await onSendMessage(userInput);
    setIsTyping(false);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <span>SmartBot</span>
        {/* UI for tuning controls */}
        <div className="tuning-controls">
          <button
            className={tuningStyle === 'precise' ? 'active' : ''}
            onClick={() => setTuningStyle('precise')}
          >
            Precise
          </button>
          <button
            className={tuningStyle === 'creative' ? 'active' : ''}
            onClick={() => setTuningStyle('creative')}
          >
            Creative
          </button>
        </div>
      </div>
      <div className="message-list" ref={messageListRef}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))
        ) : (
          <div style={{textAlign: 'center', color: '#8e8ea0'}}>Start a conversation!</div>
        )}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="message-input-container">
        <MessageInput onSendMessage={handleSend} />
      </div>
    </div>
  );
};

export default ChatPage;