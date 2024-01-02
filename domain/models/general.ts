export interface Position {
  x: number;
  y: number;
}

export enum CompassDirection {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

export type TurnDirection = "left" | "right";
