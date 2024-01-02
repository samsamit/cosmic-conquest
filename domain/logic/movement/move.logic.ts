import { Entity } from "../../models/entities/entity.model";
import { CompassDirection, Position } from "../../models/general";

export const moveEntity = (entity: Entity, distance: number): Position => {
  if (entity.type === "explosion") {
    throw new Error("Entity does not have a direction");
  }
  const directionToDelta = {
    [CompassDirection.North]: { x: 0, y: -distance },
    [CompassDirection.NorthEast]: { x: distance, y: -distance },
    [CompassDirection.East]: { x: distance, y: 0 },
    [CompassDirection.SouthEast]: { x: distance, y: distance },
    [CompassDirection.South]: { x: 0, y: distance },
    [CompassDirection.SouthWest]: { x: -distance, y: distance },
    [CompassDirection.West]: { x: -distance, y: 0 },
    [CompassDirection.NorthWest]: { x: -distance, y: -distance },
  };

  const delta = directionToDelta[entity.direction];
  return {
    x: entity.position.x + delta.x,
    y: entity.position.y + delta.y,
  };
};
