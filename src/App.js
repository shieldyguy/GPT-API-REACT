// App.js

import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { handleCommand } from "./utils/commandHandler";
import { systemPrompt } from "./system/systemPrompt";
import "./styles.css";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("User");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [chatOutput, setChatOutput] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([
    { role: "system", content: systemPrompt },
  ]);
  const [summaries, setSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch models when API key changes
  useEffect(() => {
    if (apiKey) {
      fetchModels(apiKey);
    }
  }, [apiKey]);

  const fetchModels = async (key) => {
    try {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const modelList = data.data || [];

      // Set models in state
      setModels(modelList);

      // Check if "gpt-4" is available, and set it as the default if so
      const defaultModel = modelList.find((m) => m.id === "gpt-4");
      if (defaultModel) {
        setModel("gpt-4o-mini");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const processInput = async (userInput) => {
    // Check if it's a command first
    const isCommand = handleCommand(userInput, setChatOutput, username);

    // If it was a command, return early and don't send it to ChatGPT
    if (isCommand) {
      return;
    }

    // Otherwise, proceed with sending the message to ChatGPT
    const assistantReply = await sendMessage(userInput);

    // Ensure assistantReply is not null or undefined
    if (assistantReply) {
      // Request a summary of the assistant's reply
      const summary = await sendMessage(assistantReply, {
        isSummaryRequest: true,
      });

      // Store the summary separately
      if (summary) {
        setSummaries((prev) => [...prev, summary]);
      }
    }
  };

  const sendMessage = async (userInput, options = {}) => {
    const { isSummaryRequest = false } = options;

    if (!apiKey || !userInput) {
      alert("Please enter your API key and query.");
      return;
    }

    // Determine if we should update the chat output and conversation history
    const shouldUpdateChat = !isSummaryRequest;

    if (shouldUpdateChat) {
      // Add the user's message to the conversation history
      const newHistory = [
        ...conversationHistory,
        { role: "user", content: userInput },
      ];
      setConversationHistory(newHistory);

      // Update chat output
      setChatOutput((prev) => [
        ...prev,
        { sender: username, message: userInput },
      ]);
    }

    try {
      setIsLoading(true);
      // Before making the API call, construct the messages array with summaries
      let messages;

      if (isSummaryRequest) {
        // For summarization requests, use only the assistant's reply
        const summarizationSystemPrompt =
          "You are a summarization assistant. Provide a concise summary of the following text, focusing on key events and important information. Do not include unnecessary details. Your goal is to provide very succinct summarizations in order to preserve context without wasting memory.";

        messages = [
          { role: "system", content: summarizationSystemPrompt },
          { role: "user", content: userInput },
        ];
      } else {
        // For regular messages, include summaries and recent conversation
        messages = [];

        // Include system prompt
        messages.push({ role: "system", content: systemPrompt });

        // Include summaries as a single assistant message
        if (summaries.length > 0) {
          const combinedSummaries = summaries.join(" ");
          messages.push({
            role: "assistant",
            content: `Summary of previous conversations: ${combinedSummaries}`,
          });
        }

        // Include the last 10 messages from conversation history
        const recentMessages = conversationHistory.slice(-10); // Last 5 exchanges
        messages.push(...recentMessages);

        // Add the new user input
        messages.push({ role: "user", content: userInput });
      }

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model || "gpt-4",
            messages: messages,
          }),
        }
      );
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      const result = await response.json();

      const assistantMessage =
        result.choices[0]?.message?.content || "No response received.";

      if (shouldUpdateChat) {
        // Add the assistant's message to the conversation history
        const updatedHistory = [
          ...conversationHistory,
          { role: "assistant", content: assistantMessage },
        ];
        setConversationHistory(updatedHistory);

        // Update chat output
        setChatOutput((prev) => [
          ...prev,
          { sender: "ChatGPT", message: assistantMessage },
        ]);

        // Check if we need to summarize older messages
        if (updatedHistory.length > 12) {
          // Extract messages older than the last 5 exchanges (each exchange is user and assistant)
          const messagesToSummarize = updatedHistory.slice(1, -10); // Exclude system prompt and recent messages

          // Create a combined text to summarize
          const textToSummarize = messagesToSummarize
            .map(
              (msg) =>
                `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
            )
            .join("\n");

          // Request a summary
          const summary = await sendMessage(textToSummarize, {
            isSummaryRequest: true,
          });

          if (summary) {
            // Add the new summary to the summaries array
            setSummaries((prev) => [...prev, summary]);

            // Remove the summarized messages from the conversation history
            const remainingHistory = [
              conversationHistory[0], // Keep the system prompt
              ...updatedHistory.slice(-10),
            ];
            setConversationHistory(remainingHistory);
          }
        }
      }

      return assistantMessage;
    } catch (error) {
      console.error("Error during API call:", error);
      if (shouldUpdateChat) {
        setChatOutput((prev) => [
          ...prev,
          { sender: "Error", message: error.message },
        ]);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Sidebar
        apiKey={apiKey}
        setApiKey={setApiKey}
        username={username}
        setUsername={setUsername}
        model={model}
        setModel={setModel}
        models={models}
      />
      <ChatWindow
        processInput={processInput}
        chatOutput={chatOutput}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
