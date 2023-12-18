import { Server } from "bun";
import GameManager from "../services/gameManager.service";

export interface ClientSocketData {
  type: "client";
  createdAt: number;
}

export const handleClientRoute = (
  req: Request,
  server: Server,
  gameManager: GameManager
) => {};
