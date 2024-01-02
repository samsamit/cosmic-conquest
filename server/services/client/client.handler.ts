import { GameUpdate } from "@domain/models/game/game.model";
import { AppSocket } from "../../types";

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
        client.socket.send(JSON.stringify({ entities, mapHeight, mapWidth }));
      });
    },
  };
  return clientHandler;
};
