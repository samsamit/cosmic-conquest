import { Participant } from "../../types";
import { GameSettings } from "./gameSettings.model";
import { Ship, createShip } from "../entities/ship/ship.model";
import {
  getDirectionToMapCenter,
  getInitialShipPositions,
} from "../../logic/game/getInitialShipPositions";
import { Entity, EntityData, getEntitiesData } from "../entities/entity.model";
import { getEntityActions } from "../../logic/game/actions/getEntityActions";
import { handleMovementActions } from "../../logic/game/actions/handleMovementActions";
import { handleShootActions } from "../../logic/game/actions/handleShootActions";
import { runEntityActions } from "../../logic/game/actions/runEntityActions";
import {
  GameTeamMap,
  getGameMaps,
} from "../../logic/mapGeneration/getGameMaps";

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
  entities: Entity[];
  settings: GameSettings;
  gameLoopState: GameLoopState;
  gameLoopTimestamp: number | null;
}

export interface GameUpdate {
  id: string;
  entities: EntityData[];
  mapWidth: number;
  mapHeight: number;
  teamMaps: GameTeamMap[];
}

export interface GameFunctions {
  setState: (state: GameState) => Game;
  addAction: (action: Action) => Game;
  gameRunner: (updateGameStateCallback: (update: GameUpdate) => void) => void;
  getUpdate: () => GameUpdate;
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
    collisionDamage: 10,
    shipMaxHealth: 100,
    shipVisionRange: 3,
  };

  const initialShipPositions = getInitialShipPositions(
    gameSettings.mapWidth,
    gameSettings.mapHeight,
    gameSettings.shipHitboxRadius,
    gameData.participants
  );

  const entities: Ship[] = initialShipPositions.map((shipPosition) =>
    createShip({
      id: shipPosition.shipId,
      health: gameSettings.shipMaxHealth,
      position: shipPosition.position,
      team: shipPosition.team,
      teamColor: shipPosition.teamColor,
      visionRange: gameSettings.shipVisionRange,
      direction: getDirectionToMapCenter(
        shipPosition.position,
        gameSettings.mapWidth,
        gameSettings.mapHeight
      ),
      hitboxRadius: gameSettings.shipHitboxRadius,
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
      console.log(`Game ${this.id} state set to ${GameState[state]}`);
      return this;
    },
    addAction(action) {
      if (this.actionQueue.find((a) => a.botToken === action.botToken)) {
        throw new Error("Bot already sent action");
      }
      this.actionQueue.push(action);
      return this;
    },
    gameRunner(updateGameStateCallback) {
      if (this.gameLoopTimestamp === null) {
        this.gameLoopTimestamp = performance.now();
        const gameMaps = getGameMaps(this.entities, this.settings);
        updateGameStateCallback({
          id: this.id,
          entities: getEntitiesData(this.entities),
          mapHeight: this.settings.mapHeight,
          mapWidth: this.settings.mapWidth,
          teamMaps: gameMaps.teamMaps,
        });
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
          const { moveActions, shootActions, turnActions } = getEntityActions(
            this.actionQueue,
            this.entities
          );
          const entityMoveActions = handleMovementActions(
            this.entities,
            moveActions,
            this.settings.collisionDamage
          );
          const entityShootActions = handleShootActions(
            shootActions,
            this.entities
          );

          const updatedEntities = runEntityActions(
            [...entityMoveActions, ...turnActions, ...entityShootActions],
            this.entities
          );

          this.entities = updatedEntities;
          this.gameLoopState = "render";
          this.actionQueue = [];
          break;
        }

        case "render": {
          if (elapsedTime > this.settings.renderWaitTime) {
            this.gameLoopTimestamp = performance.now();
            const gameMaps = getGameMaps(this.entities, this.settings);
            updateGameStateCallback({
              id: this.id,
              entities: getEntitiesData(this.entities),
              mapHeight: this.settings.mapHeight,
              mapWidth: this.settings.mapWidth,
              teamMaps: gameMaps.teamMaps,
            });
            this.gameLoopState = "waitingForActions";
          }
          break;
        }
      }
    },
    getUpdate() {
      const gameMaps = getGameMaps(this.entities, this.settings);
      return {
        id: this.id,
        entities: getEntitiesData(this.entities),
        mapHeight: this.settings.mapHeight,
        mapWidth: this.settings.mapWidth,
        teamMaps: gameMaps.teamMaps,
      };
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

interface ShootAction extends BaseAction {
  action: "shoot";
  mass: number;
  speed: number;
}

export type Action = MoveAction | TurnAction | ShootAction;
