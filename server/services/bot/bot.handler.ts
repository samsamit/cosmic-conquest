import { Tile } from "@domain/models/map.model";
import { AppSocket } from "../../types";
import { GameTeamMap } from "@domain/logic/mapGeneration/getGameMaps";
import { ParticipantData } from "controllers/game/game.schema";

interface BotConnection {
  botToken: string;
  name: string;
  connectionToken: string;
  socket: AppSocket | null;
  gameId: string | null;
}

type ConnectionToken = string;
interface BotHandlerData {
  bots: Map<ConnectionToken, Map<string, BotConnection>>;
}

export interface BotData {
  botToken: string;
  gameId: string | null;
  connectionToken: string;
}

interface BotHandler extends BotHandlerData {
  addBot: (
    userConnectionToken: string,
    botToken: string,
    socket: AppSocket | null,
    gameId: string | null,
    name: string
  ) => BotHandler;
  removeBot: (userConnectionToken: string, botToken: string) => BotHandler;
  getBot: (
    userConnectionToken: string,
    botToken: string
  ) => BotConnection | undefined;
  getUserBotData: (userConnectionToken: string) => BotData[];
  getConnectionTokensFromBotsInGame: (gameId: string) => ConnectionToken[];
  setGameId: (
    gameId: string,
    connectionToken: string,
    participatingBots: ParticipantData[]
  ) => BotHandler;
  sendGameState: (gameId: string, teamMaps: GameTeamMap[]) => void;
}

export const BotHandler = (): BotHandler => {
  const botHandler: BotHandler = {
    bots: new Map(),
    addBot(userConnectionToken, botToken, socket, gameId, name) {
      const connectionTokenBots = this.bots.get(userConnectionToken);
      if (!connectionTokenBots) {
        this.bots.set(
          userConnectionToken,
          new Map([
            [
              botToken,
              {
                botToken,
                name,
                socket,
                gameId,
                connectionToken: userConnectionToken,
              },
            ],
          ])
        );

        return this;
      }
      if (connectionTokenBots.has(botToken)) {
        throw new Error("Bot with same token already connected");
      }
      const updatedBots = connectionTokenBots.set(botToken, {
        botToken,
        name,
        socket,
        gameId,
        connectionToken: userConnectionToken,
      });
      this.bots = this.bots.set(userConnectionToken, updatedBots);
      return this;
    },
    removeBot(userConnectionToken, botToken) {
      const userBots = this.bots.get(userConnectionToken);
      if (!userBots) return this;
      const bot = userBots.get(botToken);
      if (bot?.socket) bot.socket.close();
      userBots.delete(botToken);
      return this;
    },
    getBot(userConnectionToken, botToken) {
      return this.bots.get(userConnectionToken)?.get(botToken);
    },
    setGameId(gameId, connectionToken, participatingBots) {
      for (const [_, bots] of this.bots.entries()) {
        for (const [botToken, bot] of bots.entries()) {
          const participant = participatingBots.find(
            (b) => b.botToken === bot.botToken
          );
          if (participant) {
            console.log("Adding bot to game", botToken, gameId);
            bot.gameId = gameId;
          }
        }
      }
      participatingBots.forEach((participant) => {
        if (participant.manualControl) {
          this.addBot(
            connectionToken,
            participant.botToken,
            null,
            gameId,
            participant.name
          );
        }
      });
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
            if (bot.socket) bot.socket.send(JSON.stringify({ map }));
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
    getUserBotData(userConnectionToken) {
      const bots = this.bots.get(userConnectionToken);
      if (!bots) {
        return [];
      }
      return [...bots.values()].map<BotData>((bot) => ({
        botToken: bot.botToken,
        gameId: bot.gameId,
        connectionToken: bot.connectionToken,
      }));
    },
  };
  return botHandler;
};
