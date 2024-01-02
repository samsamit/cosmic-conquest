import { Entity } from "../../../models/entities/entity.model";
import {
  EntityShootAction,
  EntityAction,
} from "../../../models/entities/entityAction.model";
import { createProjectile } from "../../../models/entities/projectile/projectile.model";
import { Ship } from "../../../models/entities/ship/ship.model";
import { getCollidingEntities } from "../../collision.logic";

export const handleShootActions = (
  actions: EntityShootAction[],
  entities: Entity[]
) => {
  const newActions: EntityAction[] = [];
  actions.forEach((action) => {
    const entity = entities.find(
      (entity): entity is Ship =>
        entity.id === action.entityId && entity.type === "ship"
    );
    if (!entity) {
      throw new Error(`Entity with id ${action.entityId} not found`);
    }
    const projectilePosition = entity.getProjectilePosition();
    const projectile = createProjectile({
      position: projectilePosition,
      direction: entity.direction,
      id: entity.id,
      mass: action.mass,
      speed: action.speed,
    });
    const collidingEntities = getCollidingEntities(projectile, entities);
    if (collidingEntities.length > 0) {
      collidingEntities.forEach((collidingEntity) => {
        newActions.push({
          type: "damage",
          entityId: collidingEntity.id,
          damage: projectile.getDamage(),
        });
        newActions.push({
          type: "explode",
          position: projectilePosition,
        });
      });
    } else {
      newActions.push(action);
    }
  });

  return newActions;
};
