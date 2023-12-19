import { getUserRepository } from "../domain/user/user.repository";
import { BotSocketData } from "../networking/bot.network";
import { ClientSocket } from "../types";

class UserManager {
  private clients = new Map<string, ClientSocket>();

  public addConnectedClient(userId: string, socket: ClientSocket) {
    this.clients.set(userId, socket);
  }

  public removeConnectedClient(userId: string) {
    this.clients.delete(userId);
  }

  public handleBotConnection(socketData: BotSocketData, connected: boolean) {
    const { userId, botToken, connectionToken } = socketData;
    getUserRepository.setBotConnection(userId, botToken, connected);

    const socket = this.clients.get(connectionToken);
    if (socket) {
      socket.send("connected: ", connected); // TODO: send connection info to client
    }
  }
}

export default UserManager;
