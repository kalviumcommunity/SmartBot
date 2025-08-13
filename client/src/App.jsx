// client/src/App.jsx
import React, { useState } from 'react';
import ChatPage from './pages/ChatPage';
import Sidebar from './components/Sidebar';
import { sendMessageToBot } from './services/api';

function App() {
  const [allMessages, setAllMessages] = useState({
    'chat-1': [{ sender: 'bot', text: 'Hello! How can I help you today?' }]
  });
  const [chatHistory, setChatHistory] = useState([
    { id: 'chat-1', title: 'New Chat' }
  ]);
  const [currentChatId, setCurrentChatId] = useState('chat-1');
  
  // State for tuning style
  const [tuningStyle, setTuningStyle] = useState('precise'); // 'precise' or 'creative'

  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setChatHistory(prev => [...prev, { id: newChatId, title: 'New Chat' }]);
    setAllMessages(prev => ({
      ...prev,
      [newChatId]: [{ sender: 'bot', text: 'How can I assist you now?' }]
    }));
    setCurrentChatId(newChatId);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleSendMessage = async (userInput) => {
    const userMessage = { sender: 'user', text: userInput };
    const updatedMessages = [...allMessages[currentChatId], userMessage];
    setAllMessages(prev => ({ ...prev, [currentChatId]: updatedMessages }));

    if (allMessages[currentChatId].length === 1) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === currentChatId ? { ...chat, title: userInput } : chat
      ));
    }

    try {
      // Pass tuningStyle to the API call
      const botResponse = await sendMessageToBot(userInput, tuningStyle);
      setAllMessages(prev => ({
        ...prev,
        [currentChatId]: [...updatedMessages, botResponse]
      }));
    } catch (error) {
      const errorResponse = { sender: 'bot', text: 'Sorry, something went wrong.' };
      setAllMessages(prev => ({
        ...prev,
        [currentChatId]: [...updatedMessages, errorResponse]
      }));
    }
  };

  const currentChatMessages = allMessages[currentChatId] || [];

  return (
    <div className="app-container">
      <Sidebar
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />
      <ChatPage
        messages={currentChatMessages}
        onSendMessage={handleSendMessage}
        // Pass down the style and its setter function
        tuningStyle={tuningStyle}
        setTuningStyle={setTuningStyle}
      />
    </div>
  );
}

export default App;