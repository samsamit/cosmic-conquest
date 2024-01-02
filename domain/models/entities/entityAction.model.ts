import { Position } from "../general";

export interface EntityMoveAction {
  type: "move";
  entityId: string;
  distance: number;
}

export interface EntityTurnAction {
  type: "turn";
  entityId: string;
  direction: "left" | "right";
}

export interface EntityDamageAction {
  type: "damage";
  entityId: string;
  damage: number;
}

interface EntityExplodeAction {
  type: "explode";
  position: Position;
  entityId?: string;
}

export interface EntityShootAction {
  type: "shoot";
  entityId: string;
  mass: number;
  speed: number;
}

export type EntityAction =
  | EntityMoveAction
  | EntityTurnAction
  | EntityDamageAction
  | EntityShootAction
  | EntityExplodeAction;
