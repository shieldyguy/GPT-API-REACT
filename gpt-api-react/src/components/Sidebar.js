// src/components/Sidebar.js
import React from 'react';

function Sidebar({
  apiKey,
  setApiKey,
  username,
  setUsername,
  model,
  setModel,
  models,
  userInput,
  setUserInput,
  sendMessage,
  totalCost,
}) {
  return (
    <div className="sidebar">
      <h2>ChatGPT API</h2>
      <label htmlFor="apiKey">API Key:</label>
      <input
        type="password"
        id="apiKey"
        placeholder="Enter your API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />

      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label htmlFor="model">Choose Model:</label>
      <select
        id="model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      >
        {models.map((mod) => (
          <option key={mod.id} value={mod.id}>
            {mod.id}
          </option>
        ))}
      </select>

      <div id="apiCost">Total Cost: ${totalCost.toFixed(4)}</div>
    </div>
  );
}

export default Sidebar;
