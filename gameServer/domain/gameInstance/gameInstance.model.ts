import { BotSocket } from "../../types";

interface GameInstanceData {
  gameId: string;
  participatingBotIds: string[];
  sockets: Map<string, BotSocket>;
}

export interface GameInstance extends GameInstanceData {}

export const createGameInstance = (gameId: string): GameInstance => ({
  gameId,
  participatingBotIds: [],
  sockets: new Map(),
});
