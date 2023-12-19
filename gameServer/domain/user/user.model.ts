import { getUserRepository } from "./user.repository";

export interface UserData {
  id: string;
  connectionToken: string;
}

export interface User extends UserData {}

export const createUser = (userData: UserData): User => ({
  ...userData,
});
