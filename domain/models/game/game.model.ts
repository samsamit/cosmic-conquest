import { Participant } from "../../types";

export enum GameState {
  READY,
  RUNNING,
  PAUSED,
  STOPPED,
}
export interface GameData {
  id: string;
  participants: Participant[];
  state: GameState;
}

export interface GameFunctions {
  setState: (state: GameState) => Game;
}

export type Game = GameData & GameFunctions;

export const createGame = (
  gameData: Pick<GameData, "id" | "participants">
): Game => ({
  ...gameData,
  state: GameState.READY,
  setState(state) {
    this.state = state;
    return this;
  },
});
