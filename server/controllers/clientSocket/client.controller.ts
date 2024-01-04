import Elysia, { t } from "elysia";
import { getServerDecorators } from "server.init";
import { BotData } from "services/bot/bot.handler";

export const clientController = new Elysia()
  .use(getServerDecorators)
  .guard({
    query: t.Object({
      connectionToken: t.String(),
    }),
  })
  .ws("/client", {
    open: (socket) => {
      const connectionToken = socket.data.query["connectionToken"];
      socket.data.clientHandler.addClient(connectionToken, socket.raw);
      const allBots = socket.data.botHandler.getUserBots(connectionToken);
      socket.data.clientHandler.sendBots(
        connectionToken,
        allBots.map<BotData>((bot) => ({
          botToken: bot.botToken,
          gameId: bot.gameId,
        }))
      );
      console.log("client connected with token: ", connectionToken);
    },
    close: (socket) => {
      const connectionToken = socket.data.query["connectionToken"];
      socket.data.clientHandler.removeClient(connectionToken);
      console.log("client disconnected");
    },
    message: (socket, message) => {
      const connectionToken = socket.data.query["connectionToken"];
      console.log("client sent message", message);
    },
  });
