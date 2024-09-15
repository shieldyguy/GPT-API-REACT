// Utility function for parsing commands

export const parseCommand = (userInput) => {
  const input = userInput.trim().toLowerCase();

  // Command for dice rolls (e.g., roll d20, roll d6)
  const diceRollMatch = input.match(/^roll d(\d+)$/);
  if (diceRollMatch) {
    const diceSides = parseInt(diceRollMatch[1], 10);
    return { type: "roll", sides: diceSides };
  }

  // Command for attacking (e.g., attack)
  if (input === "attack") {
    return { type: "attack" };
  }

  // Command for checking inventory (e.g., check inventory)
  if (input === "check inventory") {
    return { type: "inventory" };
  }

  // No recognized command, send to ChatGPT
  return { type: "chatgpt", message: userInput };
};
