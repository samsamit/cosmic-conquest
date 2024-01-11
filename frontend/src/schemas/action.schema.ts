export interface MoveAction {
  action: "move";
  distance: number;
}

export interface TurnAction {
  action: "turn";
  direction: "left" | "right";
}

export type ManualAction = MoveAction | TurnAction;

export interface ClientAction {
  event: "manualAction";
  gameId: string;
  shipId: string;
  action: ManualAction;
}
