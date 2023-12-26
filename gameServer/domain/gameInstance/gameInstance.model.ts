import { BotAction } from "../../communication/bot/bot.communication";
import { BotSocket } from "../../types";
import { GameSettings } from "./gameSettings.model";

export interface Participant {
  teamName: string;
  teamColor: string;
  botToken: string;
}
export interface BotGameAction {
  botToken: string;
  action: BotAction;
}
interface GameInstanceData {
  gameId: string;
  state: "ongoing" | "not-started" | "finished" | "error" | "paused";
  actionQueue: BotGameAction[];
  participants: Participant[];
  sockets: Map<string, BotSocket>;
  loopInterval: NodeJS.Timeout | null;
  gameSettings: GameSettings;
}

export interface GameInstance extends GameInstanceData {
  hasBot(botId: string): boolean;
  getParticipatingBotIds(): string[];
}

export const createGameInstance = (
  gameId: string,
  settings: GameSettings,
  participants: Participant[]
): GameInstance => ({
  gameId,
  state: "not-started",
  actionQueue: [],
  participants,
  sockets: new Map(),
  loopInterval: null,
  gameSettings: settings,
  hasBot(botId: string) {
    return this.participants.some((bot) => bot.botToken === botId);
  },
  getParticipatingBotIds() {
    return this.participants.map((bot) => bot.botToken);
  },
});
