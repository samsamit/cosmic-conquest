import { ServerWebSocket, WebSocketHandler } from "bun";
import { WebSocketData } from "..";
import { GameManager } from "../services/gameManager";
import { BotSocketData } from "./bot.network";
import UserManager from "../services/userManager";
import { BotSocket, ClientSocket } from "../types";
import {
  BotError,
  BotMessageSchema,
} from "../communication/bot/bot.communication";

export const socketHandler = (
  gameManager: GameManager,
  userManager: UserManager
): WebSocketHandler<WebSocketData> => ({
  message: (ws, message) => {
    const data = JSON.parse(String(message));
    if (isBotSocket(ws)) {
      const event = BotMessageSchema.safeParse(data);
      if (!event.success) {
        console.log("Bot message error", event.error);
        const error: BotError = { error: event.error.issues[0].message };
        ws.send(JSON.stringify(error));
        return;
      }
      gameManager.handleBotMessage(ws.data, event.data);
      return;
    }
    if (isClientSocket(ws)) {
      return;
    }
  },
  close: (ws, code, reason) => {
    if (isBotSocket(ws)) {
      gameManager.removeConnectedBot(ws.data.botToken);
      userManager.handleBotConnection(ws.data, false);
      return;
    }
    if (isClientSocket(ws)) {
      console.log("close", code, reason);
      userManager.removeConnectedClient(ws.data.userId);
      return;
    }
  },
  open: (ws) => {
    if (isClientSocket(ws)) {
      userManager.addConnectedClient(ws.data.userId, ws);
      return;
    }
    if (isBotSocket(ws)) {
      const botToken = ws.data.botToken;
      console.log("bot connected with token", botToken);
      gameManager.addConnectedBot(botToken, ws);
      userManager.handleBotConnection(ws.data, true);

      return;
    }
  },
});

const isBotSocket = (ws: ServerWebSocket<WebSocketData>): ws is BotSocket => {
  return ws.data.type === "bot";
};

const isClientSocket = (
  ws: ServerWebSocket<WebSocketData>
): ws is ClientSocket => {
  return ws.data.type === "client";
};
