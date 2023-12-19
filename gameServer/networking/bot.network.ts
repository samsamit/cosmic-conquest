import { Server } from "bun";
import { GameManager } from "../services/gameManager";

export interface BotSocketData {
  type: "bot";
  createdAt: number;
  connectionToken: string;
  userId: string;
  botToken: string;
}

export const handleBotRoute = (req: Request, server: Server) => {
  try {
    const connectionToken = req.headers.get("connectionToken");
    const botToken = req.headers.get("botToken");
    if (!connectionToken || !botToken) throw new Error("No token");
    const upgraded = server.upgrade(req, {
      data: {
        type: "bot",
        createdAt: Date.now(),
        connectionToken,
        userId: "userId", // TODO: get from connectionToken
        botToken,
      } satisfies BotSocketData,
    });
    return upgraded
      ? undefined
      : new Response("WebSocket upgrade error", { status: 400 });
  } catch (e) {
    console.error(e);
    return new Response("Unauthorized", { status: 401 });
  }
};