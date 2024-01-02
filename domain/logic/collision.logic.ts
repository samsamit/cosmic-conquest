import { Entity } from "../models/entities/entity.model";

export const getCollidingEntities = (entity: Entity, entities: Entity[]) => {
  if (entity.type === "explosion") {
    throw new Error("Entity does not have a hitbox");
  }
  const hitboxPositions = entity.getHitboxPositions().concat(entity.position);
  const collidingEntities = entities.filter((e) => {
    if (e.id === entity.id || e.type === "explosion") return false;
    const enemyHitboxPositions = e.getHitboxPositions();
    const colliding = hitboxPositions.some((p) =>
      enemyHitboxPositions.some((ep) => ep.x === p.x && ep.y === p.y)
    );
    return colliding;
  });
  return collidingEntities;
};
