import { Server } from "bun";

export interface ClientSocketData {
  type: "client";
  createdAt: number;
}

export const handleClientRoute = (req: Request, server: Server) => {};
