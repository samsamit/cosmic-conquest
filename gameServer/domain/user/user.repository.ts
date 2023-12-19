import { UserData } from "./user.model";

export const getUserRepository = {
  getUserById(id: string): UserData {
    return {
      id,
      connectionToken: "connectionToken",
    };
  },
  setBotConnection(userId: string, botToken: string, connected: boolean) {
    //TODO add bot to user info if its not there and set connected state
  },
};
