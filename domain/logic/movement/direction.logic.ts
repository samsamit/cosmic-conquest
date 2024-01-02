import { Entity } from "../../models/entities/entity.model";
import {
  CompassDirection,
  Position,
  TurnDirection,
} from "../../models/general";

export const turnEntity = (
  entity: Entity,
  direction: TurnDirection
): CompassDirection => {
  if (entity.type === "explosion") {
    throw new Error("Entity does not have a direction");
  }
  const currentDirection = entity.direction;
  const currentDirectionIndex = currentDirection.valueOf();
  const newDirectionIndex =
    (currentDirectionIndex + (direction === "left" ? -1 : 1) + 8) % 8;
  return CompassDirection[
    CompassDirection[newDirectionIndex] as keyof typeof CompassDirection
  ];
};

export const getDistanceBetweenPositions = (
  origin: Position,
  target: Position
) => {
  return Math.round(
    Math.sqrt(
      Math.pow(target.x - origin.x, 2) + Math.pow(target.y - origin.y, 2)
    )
  );
};

export const findSignalPosition = (
  origin: { x: number; y: number },
  target: { x: number; y: number },
  distance: number
) => {
  const totalDistance = Math.sqrt(
    Math.pow(target.x - origin.x, 2) + Math.pow(target.y - origin.y, 2)
  );
  const ratio = distance / totalDistance;

  const newX = origin.x + (target.x - origin.x) * ratio;
  const newY = origin.y + (target.y - origin.y) * ratio;

  return { x: Math.round(newX), y: Math.round(newY) };
};
