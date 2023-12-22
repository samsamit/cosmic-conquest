import { BotAction } from "../../communication/bot/bot.communication";
import { BotSocket } from "../../types";
import { GameSettings } from "./gameSettings.model";

interface GameTeam {
  teamName: string;
  botIds: string[];
}
interface GameInstanceData {
  gameId: string;
  state: "ongoing" | "not-started" | "finished" | "error" | "paused";
  actionQueue: BotAction[];
  teams: GameTeam[];
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
  teams: GameTeam[]
): GameInstance => ({
  gameId,
  state: "not-started",
  actionQueue: [],
  teams,
  sockets: new Map(),
  loopInterval: null,
  gameSettings: settings,
  hasBot(botId: string) {
    return this.teams.some((team) => team.botIds.includes(botId));
  },
  getParticipatingBotIds() {
    return this.teams.flatMap((team) => team.botIds);
  },
});
