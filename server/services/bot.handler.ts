import { AppSocket } from "../types";

interface BotConnection {
  botToken: string;
  socket: AppSocket;
  gameId: string | null;
}

interface BotHandlerData {
  bots: Map<string, Map<string, BotConnection>>;
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
  setGameId: (gameId: string, participatingBotIds: string[]) => BotHandler;
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
            bot.gameId = gameId;
          }
        }
      }
      return this;
    },
  };
  return botHandler;
};
