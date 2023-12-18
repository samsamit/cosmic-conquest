import { getGameStateRepository } from "./gameState.repository";
import { GameStateData } from "./gameState.schema";

export interface GameState extends GameStateData {
  repository: ReturnType<typeof getGameStateRepository>;
}

export const createGameState = (gameStateData: GameStateData): GameState => ({
  ...gameStateData,

  repository: getGameStateRepository(gameStateData),
});
