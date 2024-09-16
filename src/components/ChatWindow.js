// src/components/ChatWindow.js
import React, { useState } from "react";

function ChatWindow({ chatOutput, processInput, isLoading }) {
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form reload on submit
    processInput(userInput);
    setUserInput(""); // Clear the input field after sending message
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {chatOutput.map((chat, index) => (
          <div key={index} className="default-text">
            <span
              className={
                chat.sender === "ChatGPT" ? "chatgpt-name" : "username"
              }
            >
              {chat.sender}:
            </span>{" "}
            {chat.message}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <em></em>
          </div>
        )}
      </div>

      <form className="chat-input-box" onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
            }
          }}
        />
      </form>
    </div>
  );
}

export default ChatWindow;
