import { Entity } from "../../../models/entities/entity.model";
import {
  EntityMoveAction,
  EntityShootAction,
  EntityTurnAction,
} from "../../../models/entities/entityAction.model";
import { Projectile } from "../../../models/entities/projectile/projectile.model";
import { Action } from "../../../models/game/game.model";

export const getEntityActions = (botActions: Action[], entities: Entity[]) => {
  const moveActions: EntityMoveAction[] = [];
  const turnActions: EntityTurnAction[] = [];
  const shootActions: EntityShootAction[] = [];
  botActions.forEach((action) => {
    switch (action.action) {
      case "move":
        moveActions.push({
          type: "move",
          entityId: action.botToken,
          distance: action.distance,
        });
        break;
      case "turn":
        turnActions.push({
          type: "turn",
          entityId: action.botToken,
          direction: action.direction,
        });
        break;
      case "shoot":
        shootActions.push({
          type: "shoot",
          entityId: action.botToken,
          mass: action.mass,
          speed: action.speed,
        });
    }
  });

  entities
    .filter((e): e is Projectile => e.type === "projectile")
    .forEach((p) => {
      moveActions.push({
        type: "move",
        entityId: p.id,
        distance: p.speed,
      });
    });

  return { moveActions, turnActions, shootActions };
};
