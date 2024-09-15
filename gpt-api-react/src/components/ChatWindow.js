// src/components/ChatWindow.js
import React from 'react';

function ChatWindow({ chatOutput }) {
  return (
    <div className="chat-window">
      {chatOutput.map((chat, index) => (
        <div key={index} className="default-text">
          <span className={chat.sender === 'ChatGPT' ? 'chatgpt-name' : 'username'}>
            {chat.sender}:
          </span>{' '}
          {chat.message}
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
