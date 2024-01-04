import { GameUpdate } from "@domain/models/game/game.model";
import { AppSocket } from "../../types";
import { BotData } from "services/bot/bot.handler";

interface Client {
  connectionToken: string;
  socket: AppSocket;
}

interface ClientHandlerData {
  clients: Map<string, Client>;
}

interface ClientHandler extends ClientHandlerData {
  addClient: (connectionToken: string, socket: AppSocket) => void;
  removeClient: (connectionToken: string) => void;
  getClient: (connectionToken: string) => Client | undefined;
  sendGameState: (connectionTokens: string[], gameState: GameUpdate) => void;
  sendBots: (connectionToken: string, bots: BotData[]) => void;
}

export const ClientHandler = (): ClientHandler => {
  const clientHandler: ClientHandler = {
    clients: new Map(),
    addClient(connectionToken, socket) {
      this.clients.set(connectionToken, {
        connectionToken: connectionToken,
        socket,
      });
    },
    removeClient(connectionToken) {
      this.clients.delete(connectionToken);
    },
    getClient(connectionToken) {
      return this.clients.get(connectionToken);
    },
    sendGameState(connectionTokens, gameState) {
      connectionTokens.forEach((token) => {
        const client = this.clients.get(token);
        console.log("client", client);
        if (!client) {
          return;
        }
        console.log("sending game state to client", client.connectionToken);
        const { entities, mapHeight, mapWidth } = gameState;
        client.socket.send(
          JSON.stringify({
            event: "update",
            data: { entities, mapHeight, mapWidth },
          })
        );
      });
    },
    sendBots(connectionToken, bots) {
      const client = this.clients.get(connectionToken);
      if (!client) {
        return;
      }
      client.socket.send(JSON.stringify({ event: "bots", data: { bots } }));
    },
  };
  return clientHandler;
};
