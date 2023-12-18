import Jwt from "jsonwebtoken";
import { BotSocketData, handleBotRoute } from "./networking/bot.network";
import {
  ClientSocketData,
  handleClientRoute,
} from "./networking/client.network";
import { socketHandler } from "./networking/socketHandler";

export type WebSocketData = BotSocketData | ClientSocketData;

Bun.serve<WebSocketData>({
  async fetch(req, server) {
    // handle websocket upgrade
    const url = new URL(req.url);
    switch (url.pathname) {
      case "/ws":
        return handleBotRoute(req, server);
      case "/client":
        return handleClientRoute(req, server);
      default:
        return new Response("Not found", { status: 404 });
    }
  },
  websocket: socketHandler,
});
