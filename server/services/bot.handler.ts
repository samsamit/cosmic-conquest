import { BotAction } from "controllers/botController/bot.communication";
import { AppSocket } from "../types";

interface BotConnection {
  botToken: string;
  socket: AppSocket;
}

interface BotHandlerData {
  bots: Map<string, Map<string, BotConnection>>;
}

interface BotHandler extends BotHandlerData {
  addBot: (
    userConnectionToken: string,
    botToken: string,
    socket: AppSocket
  ) => BotHandler;
  removeBot: (userConnectionToken: string, botToken: string) => BotHandler;
  getBot: (
    userConnectionToken: string,
    botToken: string
  ) => BotConnection | undefined;
}

export const BotHandler = (): BotHandler => {
  const botHandler: BotHandler = {
    bots: new Map(),
    addBot(userConnectionToken, botToken, socket) {
      const connectionTokenBots = this.bots.get(userConnectionToken);
      if (!connectionTokenBots) {
        this.bots.set(
          userConnectionToken,
          new Map([[botToken, { botToken, socket }]])
        );

        return this;
      }
      if (connectionTokenBots.has(botToken)) {
        throw new Error("Bot with same token already connected");
      }
      const updatedBots = connectionTokenBots.set(botToken, {
        botToken,
        socket,
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
  };
  return botHandler;
};
