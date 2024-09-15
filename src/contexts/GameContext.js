import React, { createContext, useState, useContext } from "react";

// Create GameContext
const GameContext = createContext();

// Custom hook to use GameContext
export const useGame = () => {
  return useContext(GameContext);
};

// GameProvider component
export const GameProvider = ({ children }) => {
  const [inventory, setInventory] = useState(["potion", "sword", "shield"]); // Example starting inventory
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    mana: 50,
  });

  const value = {
    inventory,
    setInventory,
    playerStats,
    setPlayerStats,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
