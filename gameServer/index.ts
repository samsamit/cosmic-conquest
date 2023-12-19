import Jwt from "jsonwebtoken";
import { BotSocketData, handleBotRoute } from "./networking/bot.network";
import {
  ClientSocketData,
  handleClientRoute,
} from "./networking/client.network";
import { socketHandler } from "./networking/socketHandler";
import { GameManager } from "./services/gameManager";
import UserManager from "./services/userManager";

export type WebSocketData = BotSocketData | ClientSocketData;

const gameManager = new GameManager();
const userManager = new UserManager();

Bun.serve<WebSocketData>({
  async fetch(req, server) {
    // handle websocket upgrade
    const url = new URL(req.url);
    switch (url.pathname) {
      case "/ws":
        return handleBotRoute(req, server);
      case "/client":
        return handleClientRoute(req, server);
      case "/game":
        return new Response("Game", { status: 200 });
      default:
        return new Response("Not found", { status: 404 });
    }
  },
  websocket: socketHandler(gameManager, userManager),
});
