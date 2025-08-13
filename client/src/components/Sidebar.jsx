// client/src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ chatHistory, onNewChat, onSelectChat, currentChatId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
      <div className="chat-history-list">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className="sidebar-item"
            // Add a style to highlight the active chat
            style={{ backgroundColor: chat.id === currentChatId ? '#2A2B32' : 'transparent' }}
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.title}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-item">
          Alok Agrahari
        </div>
      </div>
    </div>
  );
};

export default Sidebar;