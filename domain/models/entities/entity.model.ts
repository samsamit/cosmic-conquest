import { CompassDirection, Position, TurnDirection } from "../general";
import { Projectile, ProjectileData } from "./projectile/projectile.model";
import { Ship, ShipData } from "./ship/ship.model";

export interface BaseEntityData {
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
export type EntityData = ShipData | ProjectileData | Explosion;

export interface EntityFunctions {
  move: (distance: number) => Entity;
  turn: (turnDirection: TurnDirection) => Entity;
  getHitboxPositions: () => Position[];
  data: () => EntityData;
}

export const getEntitiesData = (entities: Entity[]): EntityData[] =>
  entities.map((entity) => {
    switch (entity.type) {
      case "ship":
        return entity.data();
      case "projectile":
        return entity.data();
      case "explosion":
        return entity;
    }
  });
