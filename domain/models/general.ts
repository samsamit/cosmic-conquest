export interface Position {
  x: number;
  y: number;
}

export const CompassDirectionList = [
  "North",
  "NorthEast",
  "East",
  "SouthEast",
  "South",
  "SouthWest",
  "West",
  "NorthWest",
] as const;

export type CompassDirection = (typeof CompassDirectionList)[number];

export type TurnDirection = "left" | "right";
