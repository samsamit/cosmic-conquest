import { ServerWebSocket, WebSocketHandler } from "bun";
import { WebSocketData } from "..";
import { GameManager } from "../services/gameManager";
import { BotSocketData } from "./bot.network";
import UserManager from "../services/userManager";

export const socketHandler = (
  gameManager: GameManager,
  userManager: UserManager
): WebSocketHandler<WebSocketData> => ({
  message: (ws, data) => {
    const type = ws.data.type;
    switch (type) {
      case "bot":
        // gameManager.handleBotMessage(ws, data);
        break;
      case "client":
        console.log("message", data);
        break;
    }
  },
  close: (ws, code, reason) => {
    const type = ws.data.type;
    switch (type) {
      case "bot":
        gameManager.removeConnectedBot(ws.data.botToken);
        userManager.handleBotConnection(ws.data, false);
        break;
      case "client":
        console.log("close", code, reason);
        userManager.removeConnectedClient(ws.data.userId);
        break;
    }
  },
  open: (ws) => {
    if (ws.data.type === "client") return console.log("client connected");
    if (isBotSocket(ws)) {
      const botToken = ws.data.botToken;
      gameManager.addConnectedBot(botToken, ws);
      userManager.handleBotConnection(ws.data, true);
      console.log("bot connected with token", botToken);
    }
  },
});

const isBotSocket = (
  ws: ServerWebSocket<WebSocketData>
): ws is ServerWebSocket<BotSocketData> => {
  return ws.data.type === "bot";
};
