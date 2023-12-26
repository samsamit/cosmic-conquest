import { Direction, Position } from "../../domain/general.schema";

export const compassList = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const;

export const getForwardPosition = (
  position: Position,
  direction: Direction,
  distance: number
): Position => {
  switch (direction) {
    case "N":
      return { x: position.x, y: position.y - distance };
    case "NE":
      return { x: position.x + distance, y: position.y - distance };
    case "E":
      return { x: position.x + distance, y: position.y };
    case "SE":
      return { x: position.x + distance, y: position.y + distance };
    case "S":
      return { x: position.x, y: position.y + distance };
    case "SW":
      return { x: position.x - distance, y: position.y + distance };
    case "W":
      return { x: position.x - distance, y: position.y };
    case "NW":
      return { x: position.x - distance, y: position.y - distance };
  }
};

export const isTurnAllowed = (
  start: Direction,
  end: Direction,
  maxTurnRadius: number
): boolean => {
  const startIdx = compassList.indexOf(start);
  const endIdx = compassList.indexOf(end);
  const diff = Math.abs(startIdx - endIdx);
  return diff <= maxTurnRadius;
};

export const getOppositeDirection = (direction: Direction): Direction => {
  const index = compassList.indexOf(direction);
  const oppositeIndex = (index + 4) % compassList.length;
  return compassList[oppositeIndex];
};

export const getStepsBetweenPositions = (
  start: Position,
  end: Position
): Position[] => {
  const steps: Position[] = [];
  const diffX = end.x - start.x;
  const diffY = end.y - start.y;
  const diff = Math.max(Math.abs(diffX), Math.abs(diffY));
  for (let i = 1; i < diff + 1; i++) {
    const x = Math.round(start.x + (diffX / diff) * i);
    const y = Math.round(start.y + (diffY / diff) * i);
    steps.push({ x, y });
  }
  return steps;
};
