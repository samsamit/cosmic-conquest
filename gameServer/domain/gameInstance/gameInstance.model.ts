import { BotAction } from "../../communication/bot/bot.communication";
import { BotSocket } from "../../types";

interface GameInstanceData {
  gameId: string;
  actionQueue: BotAction[];
  participatingBotIds: string[];
  sockets: Map<string, BotSocket>;
}

export interface GameInstance extends GameInstanceData {}

export const createGameInstance = (gameId: string): GameInstance => ({
  gameId,
  actionQueue: [],
  participatingBotIds: [],
  sockets: new Map(),
});
