import Elysia, { t } from "elysia";
import { getServerDecorators } from "server.init";
import { BotData } from "services/bot/bot.handler";
import { ClientEventSchema } from "./client.communication";

export const clientController = new Elysia()
  .use(getServerDecorators)
  .guard({
    query: t.Object({
      connectionToken: t.String(),
    }),
  })
  .ws("/client", {
    body: ClientEventSchema,
    open: (socket) => {
      const connectionToken = socket.data.query["connectionToken"];
      socket.data.clientHandler.addClient(connectionToken, socket.raw);
      const allBots = socket.data.botHandler.getUserBotData(connectionToken);
      socket.data.clientHandler.sendBots(connectionToken, allBots);
      socket.data.clientHandler.sendConnectionInfo(connectionToken);
      console.log("client connected with token: ", connectionToken);
    },
    close: (socket) => {
      const connectionToken = socket.data.query["connectionToken"];
      socket.data.clientHandler.removeClient(connectionToken);
      console.log("client disconnected");
    },
    message: (socket, payload) => {
      switch (payload.event) {
        case "botAction":
          try {
            const gameId = socket.data.gameManager.getBotsGameID(
              payload.botToken
            );
            if (!gameId) {
              socket.send("Bot not in game");
              return;
            }
            const { botToken, action: actionPayload } = payload;
            switch (actionPayload.action) {
              case "move":
                socket.data.gameManager.addAction(gameId, {
                  botToken,
                  action: "move",
                  distance: actionPayload.distance,
                });
                break;
              case "turn":
                socket.data.gameManager.addAction(gameId, {
                  botToken,
                  action: "turn",
                  direction: actionPayload.direction,
                });
                break;
            }
            console.log("client bot sent message", actionPayload);
          } catch (e) {
            if (e instanceof Error) {
              console.log(e.message);
              socket.send(e.message);
            } else {
              console.log(e);
              socket.send("unknown error");
            }
          }
          break;
      }
    },
  });
