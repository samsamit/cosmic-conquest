import Elysia, { t } from "elysia";
import { BotActionSchema } from "./bot.communication";
import { getServerDecorators } from "server.init";
import { BotData } from "services/bot/bot.handler";

export const botController = new Elysia()
  .use(getServerDecorators)
  .guard({
    query: t.Object({
      connectionToken: t.String(),
      botToken: t.String(),
    }),
  })
  .ws("/bot", {
    body: BotActionSchema,
    open: (socket) => {
      try {
        const connectionToken = socket.data.query.connectionToken;
        const botToken = socket.data.query.botToken;
        const gameId = socket.data.gameManager.getBotsGameID(botToken);
        console.log("bots gameId", gameId);
        socket.data.botHandler.addBot(
          connectionToken,
          botToken,
          socket.raw,
          gameId
        );
        const allBots = socket.data.botHandler.getUserBotData(connectionToken);
        socket.data.clientHandler.sendBots(connectionToken, allBots);

        console.log("bot connected");
        socket.send("connection_ok");
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          socket.send(e.message);
        } else {
          console.log(e);
          socket.send("unknown error");
        }
        socket.close();
      }
    },
    close: (socket) => {
      const connectionToken = socket.data.query.connectionToken;
      const botToken = socket.data.query.botToken;
      socket.data.botHandler.removeBot(connectionToken, botToken);
      const allBots = socket.data.botHandler.getUserBotData(connectionToken);
      socket.data.clientHandler.sendBots(connectionToken, allBots);
      console.log("bot disconnected");
    },
    message: (socket, action) => {
      const botToken = socket.data.query.botToken;
      const gameId = socket.data.gameManager.getBotsGameID(botToken);
      if (!gameId) {
        socket.send("Bot not in game");
        socket.close();
        return;
      }
      try {
        switch (action.action) {
          case "move":
            socket.data.gameManager.addAction(gameId, {
              botToken,
              action: "move",
              distance: action.distance,
            });
            break;
          case "turn":
            socket.data.gameManager.addAction(gameId, {
              botToken,
              action: "turn",
              direction: action.direction,
            });
            break;
        }
        console.log("bot sent message", action);
        socket.send("action_ok");
      } catch (e) {
        if (e instanceof Error) {
          console.log(e.message);
          socket.send(e.message);
        } else {
          console.log(e);
          socket.send("unknown error");
        }
      }
    },
  });
