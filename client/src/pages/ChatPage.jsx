// client/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import MessageInput from '../components/MessageInput';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';

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
        <div className="tuning-controls">
          {/* --- UPDATED BUTTONS --- */}
          <button
            className={tuningStyle === 'precise' ? 'active' : ''}
            onClick={() => setTuningStyle('precise')}
          >
            Precise (Temp)
          </button>
          <button
            className={tuningStyle === 'creative' ? 'active' : ''}
            onClick={() => setTuningStyle('creative')}
          >
            Creative (Temp)
          </button>
          {/* --- NEW TOP-K BUTTON --- */}
          <button
            className={tuningStyle === 'topk' ? 'active' : ''}
            onClick={() => setTuningStyle('topk')}
          >
            Top-K
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