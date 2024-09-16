// gameState.js

// The game state object
const gameState = {
  player: {
    name: "Mario",
    health: 100,
    inventory: ["beans", "rice", "bananas"],
    skills: [],
  },
  world: {
    currentLocation: "Zilker NW",
    visitedLocations: [],
    npcStatuses: {},
  },
  quests: {
    mainQuest: "",
    sideQuests: [],
    completedQuests: [],
  },
  keyEvents: [],
  summaries: {
    immediatePast: [], // Last few turns
    recentEvents: [], // Summarized recent events
    distantPast: [], // Older summaries
  },
};

// Functions to interact with the game state

// Update player information
function updatePlayer(data) {
  gameState.player = { ...gameState.player, ...data };
}

// Update world information
function updateWorld(data) {
  gameState.world = { ...gameState.world, ...data };
}

// Add a new quest
function addQuest(type, quest) {
  if (type === "main") {
    gameState.quests.mainQuest = quest;
  } else if (type === "side") {
    gameState.quests.sideQuests.push(quest);
  }
}

// Mark a quest as completed
function completeQuest(quest) {
  // Remove from active quests
  gameState.quests.sideQuests = gameState.quests.sideQuests.filter(
    (q) => q !== quest
  );
  // Add to completed quests
  gameState.quests.completedQuests.push(quest);
}

// Add a key event
function addKeyEvent(event) {
  gameState.keyEvents.push(event);
}

// Get the current game state
function getGameState() {
  return JSON.parse(JSON.stringify(gameState)); // Return a deep copy
}

// Export the functions
module.exports = {
  updatePlayer,
  updateWorld,
  addQuest,
  completeQuest,
  addKeyEvent,
  getGameState,
};
