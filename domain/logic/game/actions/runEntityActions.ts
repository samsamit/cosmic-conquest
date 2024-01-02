import { Entity } from "../../../models/entities/entity.model";
import { EntityAction } from "../../../models/entities/entityAction.model";

export const runEntityActions = (
  actions: EntityAction[],
  entities: Entity[]
) => {
  const entityMap = entities.reduce((map, entity) => {
    map.set(entity.id, entity);
    return map;
  }, new Map<string, Entity>());

  actions.forEach((action) => {
    switch (action.type) {
      case "move": {
        const targetEntity = entityMap.get(action.entityId);
        if (!targetEntity)
          throw new Error(`Entity with id ${action.entityId} not found`);
        if (targetEntity.type === "explosion")
          throw new Error(`Entity with id ${action.entityId} is an explosion`);
        const updatedEntity = targetEntity.move(action.distance);
        entityMap.set(targetEntity.id, updatedEntity);
        break;
      }
      case "turn": {
        const targetEntity = entityMap.get(action.entityId);
        if (!targetEntity)
          throw new Error(`Entity with id ${action.entityId} not found`);
        if (targetEntity.type === "explosion")
          throw new Error(`Entity with id ${action.entityId} is an explosion`);
        const updatedEntity = targetEntity.turn(action.direction);
        entityMap.set(targetEntity.id, updatedEntity);

        break;
      }
      case "shoot": {
        const targetEntity = entityMap.get(action.entityId);
        if (!targetEntity)
          throw new Error(`Entity with id ${action.entityId} not found`);
        if (targetEntity.type !== "ship")
          throw new Error(`Entity with id ${action.entityId} is not a ship`);
        const projectile = targetEntity.shoot(action.mass, action.speed);
        entityMap.set(projectile.id, projectile);
        break;
      }
      case "damage": {
        const targetEntity = entityMap.get(action.entityId);
        if (!targetEntity)
          throw new Error(`Entity with id ${action.entityId} not found`);
        if (targetEntity.type !== "ship")
          throw new Error(`Entity with id ${action.entityId} is not a ship`);
        const updatedEntity = targetEntity.dealDamage(action.damage);
        entityMap.set(targetEntity.id, updatedEntity);
        break;
      }
      case "explode": {
        const id = crypto.randomUUID();
        entityMap.set(id, {
          type: "explosion",
          position: action.position,
          id: action.entityId ?? id,
        });
        break;
      }
    }
  });
  return [...entityMap.values()];
};
