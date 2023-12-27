import { AppSocket } from "src/types";

interface Client {
  userConnectionToken: string;
  socket: AppSocket;
}

interface ClientHandlerData {
  clients: Map<string, Client>;
}

interface ClientHandler extends ClientHandlerData {
  addClient: (userConnectionToken: string, socket: AppSocket) => void;
  removeClient: (userConnectionToken: string) => void;
  getClient: (userConnectionToken: string) => Client | undefined;
}

export const ClientHandler = (): ClientHandler => {
  const clientHandler: ClientHandler = {
    clients: new Map(),
    addClient: (userConnectionToken, socket) => {
      clientHandler.clients.set(userConnectionToken, {
        userConnectionToken,
        socket,
      });
    },
    removeClient: (userConnectionToken) => {
      clientHandler.clients.delete(userConnectionToken);
    },
    getClient: (userConnectionToken) => {
      return clientHandler.clients.get(userConnectionToken);
    },
  };
  return clientHandler;
};
