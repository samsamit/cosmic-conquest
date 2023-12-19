import { BotAction } from "../../communication/bot/bot.communication";
import { BotSocket } from "../../types";

interface GameInstanceData {
  gameId: string;
  state: "ongoing" | "not-started" | "finished" | "error" | "paused";
  actionQueue: BotAction[];
  participatingBotIds: string[];
  sockets: Map<string, BotSocket>;
}

export interface GameInstance extends GameInstanceData {}

export const createGameInstance = (gameId: string): GameInstance => ({
  gameId,
  state: "not-started",
  actionQueue: [],
  participatingBotIds: [],
  sockets: new Map(),
});
