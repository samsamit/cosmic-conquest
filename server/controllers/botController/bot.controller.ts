import Elysia, { t } from "elysia";
import { decorators } from "../../server.plugins";
import { BotActionSchema } from "./bot.communication";

export const botController = new Elysia()
  .use(decorators)
  .guard({
    headers: t.Object({
      "connection-token": t.String(),
      "bot-token": t.String(),
    }),
  })
  .ws("/bot", {
    body: BotActionSchema,
    open: (socket) => {
      try {
        const connectionToken = socket.data.headers["connection-token"];
        const botToken = socket.data.headers["bot-token"];
        socket.data.botHandler.addBot(connectionToken, botToken, socket.raw);
        console.log("headers", socket.data.headers);
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
      const connectionToken = socket.data.headers["connection-token"];
      const botToken = socket.data.headers["bot-token"];
      socket.data.botHandler.removeBot(connectionToken, botToken);
      console.log("bot disconnected");
    },
    message: (socket, action) => {
      const connectionToken = socket.data.headers["connection-token"];
      const botToken = socket.data.headers["bot-token"];
      switch (action.action) {
        case "move":
          socket.data.gameManager.addAction(connectionToken, {
            botToken,
            action: "move",
            distance: action.distance,
          });
          break;
        case "turn":
          socket.data.gameManager.addAction(connectionToken, {
            botToken,
            action: "turn",
            direction: action.direction,
          });
          break;
      }
      console.log("bot sent message", action);
    },
  });
