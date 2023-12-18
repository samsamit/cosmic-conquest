import { GameStateData } from "./gameState.schema";

export const getGameStateRepository = (gameState: GameStateData) => ({
  getEntities() {
    return gameState.entities;
  },
  getMapSettings() {
    return gameState.mapSettings;
  },
  updateEntities(entities: GameStateData["entities"]) {
    gameState.entities = entities;
  },
});
