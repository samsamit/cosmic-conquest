import { Node } from "typescript";
import { Participant } from "../../types";
import { GameSettings } from "./gameSettings.model";
import { Ship, createShip } from "../entities/ship/ship.model";
import {
  getDirectionToMapCenter,
  getInitialShipPositions,
} from "../../logic/game/getInitialShipPositions";

export enum GameState {
  READY,
  RUNNING,
  PAUSED,
  STOPPED,
}

type GameLoopState = "waitingForActions" | "runActions" | "render";
export interface GameData {
  id: string;
  participants: Participant[];
  state: GameState;
  actionQueue: Action[];
  entities: Ship[];
  settings: GameSettings;
  gameLoopState: GameLoopState;
  gameLoopTimestamp: number | null;
}

export interface GameFunctions {
  setState: (state: GameState) => Game;
  addAction: (action: Action) => Game;
  gameRunner: (
    updateGameStateCallback: (gameId: string) => void
  ) => Promise<void>;
}

export type Game = GameData & GameFunctions;

export const createGame = (
  gameData: Pick<GameData, "id" | "participants">
): Game => {
  const gameSettings: GameSettings = {
    actionWaitTime: 0,
    renderWaitTime: 1000,
    mapWidth: 10,
    mapHeight: 10,
    shipHitboxRadius: 1,
  };

  const initialShipPositions = getInitialShipPositions(
    gameSettings.mapWidth,
    gameSettings.mapHeight,
    gameSettings.shipHitboxRadius,
    gameData.participants
  );

  const entities: Ship[] = initialShipPositions.map((shipPosition) =>
    createShip({
      botToken: shipPosition.shipId,
      position: shipPosition.position,
      direction: getDirectionToMapCenter(
        shipPosition.position,
        gameSettings.mapWidth,
        gameSettings.mapHeight
      ),
    })
  );

  const game: Game = {
    ...gameData,
    actionQueue: [],
    entities,
    state: GameState.READY,
    settings: gameSettings,
    gameLoopState: "waitingForActions",
    gameLoopTimestamp: null,
    setState(state) {
      this.state = state;
      return this;
    },
    addAction(action) {
      if (this.actionQueue.find((a) => a.botToken === action.botToken)) {
        throw new Error("Bot already sent action");
      }
      this.actionQueue.push(action);
      return this;
    },
    async gameRunner(updateGameStateCallback) {
      if (this.gameLoopTimestamp === null) {
        this.gameLoopTimestamp = performance.now();
      }

      const elapsedTime = performance.now() - this.gameLoopTimestamp;
      switch (this.gameLoopState) {
        case "waitingForActions": {
          if (
            this.actionQueue.length === this.participants.length ||
            (elapsedTime > this.settings.actionWaitTime &&
              this.settings.actionWaitTime > 0)
          ) {
            this.gameLoopState = "runActions";
            this.gameLoopTimestamp = performance.now();
          }
          break;
        }
        case "runActions": {
          this.gameLoopState = "render";
          this.actionQueue = [];
          break;
        }

        case "render": {
          if (elapsedTime > this.settings.renderWaitTime) {
            this.gameLoopTimestamp = performance.now();
            updateGameStateCallback(this.id);
            this.gameLoopState = "waitingForActions";
          }
          break;
        }
      }
    },
  };
  return game;
};

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
