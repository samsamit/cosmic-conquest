import { Direction, Position } from "../../domain/general.schema";

export const getDirectionToCenter = (
  position: Position,
  mapWidth: number,
  mapHeight: number
): Direction => {
  const centerX = mapWidth / 2;
  const centerY = mapHeight / 2;
  const xDiff = centerX - position.x;
  const yDiff = centerY - position.y;
  if (xDiff === 0 && yDiff === 0) {
    return "N";
  }
  if (xDiff === 0) {
    if (yDiff > 0) {
      return "S";
    }
    return "N";
  }
  if (yDiff === 0) {
    if (xDiff > 0) {
      return "E";
    }
    return "W";
  }
  if (xDiff > 0) {
    if (yDiff > 0) {
      return "SE";
    }
    return "NE";
  }
  if (yDiff > 0) {
    return "SW";
  }
  return "NW";
};
