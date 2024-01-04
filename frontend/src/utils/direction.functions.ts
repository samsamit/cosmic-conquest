import { Direction } from "@/schemas/gameState.schema";

export const getRotation = (direction: Direction): number => {
  switch (direction) {
    case "North":
      return 0;
    case "NorthEast":
      return 45;
    case "East":
      return 90;
    case "SouthEast":
      return 135;
    case "South":
      return 180;
    case "SouthWest":
      return 225;
    case "West":
      return 270;
    case "NorthWest":
      return 315;
  }
};
