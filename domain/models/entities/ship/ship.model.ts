import { CompassDirection, Position } from "../../general";

export interface ShipData {
  botToken: string;
  position: Position;
  direction: CompassDirection;
}

export interface Ship extends ShipData {}

export const createShip = (shipData: ShipData): Ship => ({
  ...shipData,
});
