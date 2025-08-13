// client/src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import MessageInput from '../components/MessageInput';
import ChatMessage from '../components/ChatMessage';
import TypingIndicator from '../components/TypingIndicator';

// ChatPage now receives messages and the send function as props
const ChatPage = ({ messages, onSendMessage }) => {
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    if (messageListRef.current) {
      // Corrected the typo here
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // The main logic is now in App.jsx, this just wraps it
  const handleSend = async (userInput) => {
    setIsTyping(true);
    await onSendMessage(userInput);
    setIsTyping(false);
  };

  return (
    <div className="chat-page">
      <div className="chat-header">SmartBot</div>
      <div className="message-list" ref={messageListRef}>
        {/* If there are no messages, show a welcome message or instructions */}
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