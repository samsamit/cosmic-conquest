import { Entity } from "../../models/entities/entity.model";
import { CompassDirection, Position } from "../../models/general";

export const moveEntity = (entity: Entity, distance: number): Position => {
  if (entity.type === "explosion") {
    throw new Error("Entity does not have a direction");
  }
  const directionToDelta: Record<CompassDirection, Position> = {
    North: { x: 0, y: -distance },
    NorthEast: { x: distance, y: -distance },
    East: { x: distance, y: 0 },
    SouthEast: { x: distance, y: distance },
    South: { x: 0, y: distance },
    SouthWest: { x: -distance, y: distance },
    West: { x: -distance, y: 0 },
    NorthWest: { x: -distance, y: -distance },
  };

  const delta = directionToDelta[entity.direction];
  return {
    x: entity.position.x + delta.x,
    y: entity.position.y + delta.y,
  };
};
