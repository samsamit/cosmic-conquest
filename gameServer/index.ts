import Jwt from "jsonwebtoken";
import { BotSocketData, handleBotRoute } from "./networking/bot.network";
import {
  ClientSocketData,
  handleClientRoute,
} from "./networking/client.network";
import { socketHandler } from "./networking/socketHandler";
import { GameManager } from "./services/gameManager";
import UserManager from "./services/userManager";
import { handleApiRoutes } from "./networking/api.network";

export type WebSocketData = BotSocketData | ClientSocketData;

const gameManager = new GameManager();
const userManager = new UserManager();

const server = Bun.serve<WebSocketData>({
  port: 8080,
  async fetch(req, server) {
    const url = new URL(req.url);
    switch (url.pathname) {
      case "/ws":
        return handleBotRoute(req, server);
      case "/client":
        return handleClientRoute(req, server);
      default:
        return handleApiRoutes(req, gameManager);
    }
  },
  websocket: socketHandler(gameManager, userManager),
});

gameManager.run();

console.log(`Listening on http://localhost:${server.port} ...`);
