import { Entity } from "../../../models/entities/entity.model";
import {
  EntityAction,
  EntityMoveAction,
} from "../../../models/entities/entityAction.model";
import { getCollidingEntities } from "../../collision.logic";

export const handleMovementActions = (
  entities: Entity[],
  actions: EntityMoveAction[],
  collisionDamage: number
) => {
  let moveActions = actions;
  const newActions: EntityAction[] = [];
  const longestDistance = Math.max(...moveActions.map((a) => a.distance));
  for (let i = 0; i < longestDistance; i++) {
    const movedEntities = getOneEntityMovement(entities, moveActions);
    movedEntities.forEach((movedEntity) => {
      const collidingEntities = getCollidingEntities(movedEntity, entities);
      if (collidingEntities.length > 0) {
        switch (movedEntity.type) {
          case "projectile": {
            collidingEntities.forEach((collidingEntity) => {
              newActions.push({
                type: "damage",
                entityId: collidingEntity.id,
                damage: movedEntity.getDamage(),
              });
            });
            newActions.push({
              type: "explode",
              entityId: movedEntity.id,
              position: movedEntity.position,
            });
            break;
          }
          case "ship": {
            const action = moveActions.find(
              (a) => a.entityId === movedEntity.id
            );
            if (!action) throw new Error("No action found");
            newActions.push({ ...action, distance: i });
            newActions.push({
              type: "damage",
              entityId: movedEntity.id,
              damage: collisionDamage,
            });
            break;
          }
        }
      } else {
        newActions.push({
          type: "move",
          entityId: movedEntity.id,
          distance: 1,
        });
      }
      moveActions = moveActions.reduce((acc, action) => {
        if (action.distance > 0) {
          acc.push({ ...action, distance: action.distance - 1 });
        }
        return acc;
      }, [] as EntityMoveAction[]);
    });
  }
  return newActions;
};

const getOneEntityMovement = (
  entities: Entity[],
  actions: EntityMoveAction[]
): Entity[] => {
  const movedEntities: Entity[] = [];
  actions.forEach((action) => {
    const entity = entities.find(
      (e) => e.id === action.entityId && e.type !== "explosion"
    );
    if (!entity) {
      return;
    }
    if (entity.type === "explosion") return;
    movedEntities.push(entity.move(1));
  });

  return movedEntities;
};
