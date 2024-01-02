import { CompassDirection } from "./general";

export interface EntityTile {
  type: "ship" | "projectile";
  id: string;
  direction: keyof typeof CompassDirection;
}

export interface ExplosionTile {
  type: "explosion";
}

export interface HitboxTile {
  type: "hitbox";
}

export interface EmptyTile {
  type: "empty";
}

export interface HiddenTile {
  type: "hidden";
}

export interface AsteroidTile {
  type: "asteroid";
}

export interface SignalTile {
  type: "signal";
}

export type Tile =
  | EntityTile
  | ExplosionTile
  | HitboxTile
  | EmptyTile
  | HiddenTile
  | AsteroidTile
  | SignalTile;
