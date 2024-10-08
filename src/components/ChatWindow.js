// src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from "react";
import MarkdownRenderer from "./MarkdownRenderer.jsx";

function ChatWindow({ chatOutput, processInput, isLoading }) {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form reload on submit
    processInput(userInput);
    setUserInput(""); // Clear the input field after sending message
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatOutput]);

  return (
    <div className="chat-container">
      <div className="chat-window">
        {chatOutput.map((chat, index) => (
          <div key={index} className="default-text">
            <span
              className={
                chat.sender === "ChatGPT" ? "default-text" : "username"
              }
            >
              <MarkdownRenderer
                className="markdown-text"
                markdownText={chat.message}
              />
            </span>{" "}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <em></em>
          </div>
        )}
        <div ref={messagesEndRef} />
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
