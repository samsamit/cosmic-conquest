import { Tile } from "@domain/models/map.model";
import { AppSocket } from "../../types";
import { GameTeamMap } from "@domain/logic/mapGeneration/getGameMaps";

interface BotConnection {
  botToken: string;
  socket: AppSocket;
  gameId: string | null;
}

type ConnectionToken = string;
interface BotHandlerData {
  bots: Map<ConnectionToken, Map<string, BotConnection>>;
}

interface BotHandler extends BotHandlerData {
  addBot: (
    userConnectionToken: string,
    botToken: string,
    socket: AppSocket,
    gameId: string | null
  ) => BotHandler;
  removeBot: (userConnectionToken: string, botToken: string) => BotHandler;
  getBot: (
    userConnectionToken: string,
    botToken: string
  ) => BotConnection | undefined;
  getConnectionTokensFromBotsInGame: (gameId: string) => ConnectionToken[];
  setGameId: (gameId: string, participatingBotIds: string[]) => BotHandler;
  sendGameState: (gameId: string, teamMaps: GameTeamMap[]) => void;
}

export const BotHandler = (): BotHandler => {
  const botHandler: BotHandler = {
    bots: new Map(),
    addBot(userConnectionToken, botToken, socket, gameId) {
      const connectionTokenBots = this.bots.get(userConnectionToken);
      if (!connectionTokenBots) {
        this.bots.set(
          userConnectionToken,
          new Map([[botToken, { botToken, socket, gameId }]])
        );

        return this;
      }
      if (connectionTokenBots.has(botToken)) {
        throw new Error("Bot with same token already connected");
      }
      const updatedBots = connectionTokenBots.set(botToken, {
        botToken,
        socket,
        gameId,
      });
      this.bots = this.bots.set(userConnectionToken, updatedBots);
      return this;
    },
    removeBot(userConnectionToken, botToken) {
      this.bots.get(userConnectionToken)?.delete(botToken);
      return this;
    },
    getBot(userConnectionToken, botToken) {
      return this.bots.get(userConnectionToken)?.get(botToken);
    },
    setGameId(gameId, participatingBotIds) {
      for (const [_, bots] of this.bots.entries()) {
        for (const [botToken, bot] of bots.entries()) {
          if (participatingBotIds.includes(botToken)) {
            console.log("Adding bot to game", botToken, gameId);
            bot.gameId = gameId;
          }
        }
      }
      return this;
    },
    sendGameState(gameId, teamMaps) {
      for (const [_, bots] of this.bots.entries()) {
        for (const [_, bot] of bots.entries()) {
          if (bot.gameId === gameId) {
            const map = teamMaps.find((team) =>
              team.shipIds.includes(bot.botToken)
            )?.map;
            if (!map) {
              throw new Error("Bot is not in game");
            }
            bot.socket.send(JSON.stringify({ map }));
          }
        }
      }
    },
    getConnectionTokensFromBotsInGame(gameId) {
      const connectionTokens: Set<ConnectionToken> = new Set();
      for (const [connectionToken, bots] of this.bots.entries()) {
        for (const bot of bots.values()) {
          if (bot.gameId === gameId) {
            connectionTokens.add(connectionToken);
          }
        }
      }
      return [...connectionTokens.values()];
    },
  };
  return botHandler;
};
