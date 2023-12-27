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
  actionQueue: Action[];
}

export interface GameFunctions {
  setState: (state: GameState) => Game;
  addAction: (action: Action) => Game;
}

export type Game = GameData & GameFunctions;

export const createGame = (
  gameData: Pick<GameData, "id" | "participants">
): Game => ({
  ...gameData,
  actionQueue: [],
  state: GameState.READY,
  setState(state) {
    this.state = state;
    return this;
  },
  addAction(action) {
    if (this.actionQueue.find((a) => a.botToken === action.botToken)) {
      throw new Error("Bot already sent action");
    }
    this.actionQueue.push(action);
    console.log("action added for bot", action);
    return this;
  },
});

interface BaseAction {
  botToken: string;
}

interface MoveAction extends BaseAction {
  action: "move";
  distance: number;
}

interface TurnAction extends BaseAction {
  action: "turn";
  direction: "left" | "right";
}

export type Action = MoveAction | TurnAction;
