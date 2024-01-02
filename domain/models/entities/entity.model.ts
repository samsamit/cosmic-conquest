import { CompassDirection, Position, TurnDirection } from "../general";
import { Projectile } from "./projectile/projectile.model";
import { Ship } from "./ship/ship.model";

export interface EntityData {
  id: string;
  position: Position;
  direction: CompassDirection;
  hitboxRadius: number;
}

export interface Explosion {
  type: "explosion";
  id: string;
  position: Position;
}

export type Entity = Ship | Projectile | Explosion;

export interface EntityFunctions {
  move: (distance: number) => Entity;
  turn: (turnDirection: TurnDirection) => Entity;
  getHitboxPositions: () => Position[];
}
