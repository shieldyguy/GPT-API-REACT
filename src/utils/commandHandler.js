import { parseCommand } from "./commandParser";

const {
  updatePlayer,
  updateWorld,
  addQuest,
  completeQuest,
  addKeyEvent,
  getGameState,
} = require("../system/gameState");

// Command functions
const rollDice = (sides) => {
  const rollResult = Math.floor(Math.random() * sides) + 1;
  return `You rolled a d${sides}: ${rollResult}`;
};

const attack = () => {
  return "You attack!";
};

const checkInventory = () => {
  return "You check your inventory: [potion, sword, shield]";
};

const sleep = () => {
  return "You sleep.";
};

const printGameState = () => {
  return JSON.stringify(getGameState(), null, 1);
};

// Main command handler, return true if it was a command
export const handleCommand = (userInput, setChatOutput, username) => {
  const command = parseCommand(userInput);

  if (command.type === "roll") {
    const result = rollDice(command.sides);
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true;
  }

  if (command.type === "attack") {
    const result = attack();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true;
  }

  if (command.type === "inventory") {
    const result = checkInventory();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true;
  }

  if (command.type === "sleep") {
    const result = sleep();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true;
  }

  if (command.type === "gamestate") {
    const result = printGameState();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true;
  }

  // If no command was recognized, return false (to pass it to ChatGPT)
  return false;
};
