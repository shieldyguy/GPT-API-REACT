import { parseCommand } from "./commandParser";

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

// Main command handler
export const handleCommand = (userInput, setChatOutput, username) => {
  const command = parseCommand(userInput);

  if (command.type === "roll") {
    const result = rollDice(command.sides);
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true; // This signals that it was a command
  }

  if (command.type === "attack") {
    const result = attack();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true; // This signals that it was a command
  }

  if (command.type === "inventory") {
    const result = checkInventory();
    setChatOutput((prev) => [...prev, { sender: username, message: result }]);
    return true; // This signals that it was a command
  }

  // If no command was recognized, return false (to pass it to ChatGPT)
  return false;
};
