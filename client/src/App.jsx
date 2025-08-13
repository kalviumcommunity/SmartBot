// client/src/App.jsx
import React, { useState } from 'react';
import ChatPage from './pages/ChatPage';
import Sidebar from './components/Sidebar';
import { sendMessageToBot } from './services/api';

function App() {
  // State for all chat messages, keyed by chat ID
  const [allMessages, setAllMessages] = useState({
    'chat-1': [{ sender: 'bot', text: 'Hello! How can I help you today?' }]
  });

  // State for the chat history shown in the sidebar
  const [chatHistory, setChatHistory] = useState([
    { id: 'chat-1', title: 'New Chat' }
  ]);

  // State to track the currently active chat
  const [currentChatId, setCurrentChatId] = useState('chat-1');

  // Function to start a new chat
  const handleNewChat = () => {
    const newChatId = `chat-${Date.now()}`; // Unique ID for the new chat
    setChatHistory(prev => [...prev, { id: newChatId, title: 'New Chat' }]);
    setAllMessages(prev => ({
      ...prev,
      [newChatId]: [{ sender: 'bot', text: 'How can I assist you now?' }]
    }));
    setCurrentChatId(newChatId);
  };

  // Function to switch to an existing chat
  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  // Function to handle sending a message in the current chat
  const handleSendMessage = async (userInput) => {
    const userMessage = { sender: 'user', text: userInput };

    // Update the messages for the current chat
    const updatedMessages = [...allMessages[currentChatId], userMessage];
    setAllMessages(prev => ({ ...prev, [currentChatId]: updatedMessages }));

    // If this is the first user message, update the chat title
    if (allMessages[currentChatId].length === 1) {
      setChatHistory(prev => prev.map(chat =>
        chat.id === currentChatId ? { ...chat, title: userInput } : chat
      ));
    }

    // Show typing indicator and get bot response
    // (We'll pass a setter function to ChatPage for this)
    try {
      const botResponse = await sendMessageToBot(userInput);
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

  // Get the messages for the currently selected chat
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
      />
    </div>
  );
}

export default App;