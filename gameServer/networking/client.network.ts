import { Server } from "bun";
import { GameManager } from "../services/gameManager";

export interface ClientSocketData {
  type: "client";
  userId: string;
  createdAt: number;
}

export const handleClientRoute = (req: Request, server: Server) => {
  try {
    const userId = req.headers.get("userId");
    if (!userId) throw new Error("No userId");
    const upgraded = server.upgrade(req, {
      data: {
        type: "client",
        userId,
        createdAt: Date.now(),
      } satisfies ClientSocketData,
    });
    return upgraded
      ? undefined
      : new Response("WebSocket upgrade error", { status: 400 });
  } catch (e) {
    console.error(e);
    return new Response("Unauthorized", { status: 401 });
  }
};
