import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { handleCommand } from "./utils/commandHandler";
import "./styles.css";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("User");
  const [model, setModel] = useState("");
  const [models, setModels] = useState([]);
  const [chatOutput, setChatOutput] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  // Fetch models when API key changes
  React.useEffect(() => {
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

      // Check if "gpt-4o-mini" is available, and set it as the default if so
      const defaultModel = modelList.find((m) => m.id === "gpt-4o-mini");
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
    sendMessage(userInput);
  };

  const sendMessage = async (userInput) => {
    if (!apiKey || !userInput) {
      alert("Please enter your API key and query.");
      return;
    }

    const newChatOutput = [
      ...chatOutput,
      { sender: username, message: userInput },
    ];
    setChatOutput(newChatOutput);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model || "gpt-4o-mini",
            messages: [{ role: "user", content: userInput }],
          }),
        }
      );
      if (!response.ok)
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      const result = await response.json();

      const assistantMessage =
        result.choices[0]?.message?.content || "No response received.";
      setChatOutput((prev) => [
        ...prev,
        { sender: "ChatGPT", message: assistantMessage },
      ]);

      // Update cost (Assuming cost per token is 0.0001 as placeholder)
      const tokensUsed = result.usage.total_tokens;
      const cost = tokensUsed * 0.0001;
      setTotalCost((prev) => prev + cost);
    } catch (error) {
      console.error("Error during API call:", error);
      setChatOutput((prev) => [
        ...prev,
        { sender: "Error", message: error.message },
      ]);
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
        totalCost={totalCost}
      />
      <ChatWindow processInput={processInput} chatOutput={chatOutput} />
    </div>
  );
}

export default App;
