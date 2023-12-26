import { GameSettings } from "../../../domain/gameInstance/gameSettings.model";
import { Entity } from "../../../domain/gameState/gameState.schema";
import { Position } from "../../../domain/general.schema";
import { createProjectile } from "../../../domain/projectile/projectile.model";
import { createShip } from "../../../domain/ship/ship.model";

export const handleMovement = (
  entity: Entity,
  entities: Entity[],
  gameSettings: GameSettings
): Entity[] => {
  switch (entity.type) {
    case "ship": {
      const ship = createShip(entity);
      const newShip = ship.move(1);
      const collision = checkCollision(newShip.getHitbox(), entities);
      if (collision) {
        const damagedShip = ship.dealDamage(gameSettings.collisionDamage);
        return entities.map((entity) => {
          if (entity.id === damagedShip.id) {
            return damagedShip.data();
          }
          return entity;
        });
      }
      return entities.map((entity) => {
        if (entity.id === newShip.id) {
          return newShip.data();
        }
        return entity;
      });
    }
    case "projectile": {
      const projectile = createProjectile(entity);
      const newProjectile = projectile.move(1);
      const collision = checkCollision(newProjectile.getHitbox(), entities);
      if (collision) {
        const entitiesWithoutProjectile = entities.filter(
          (entity) => entity.id !== newProjectile.id
        );
        return entitiesWithoutProjectile.map((entity) => {
          if (entity.id === collision && entity.type === "ship") {
            const damagedShip = createShip(entity).dealDamage(
              projectile.damage()
            );
            return damagedShip.data();
          }
          return entity;
        });
      }
      return entities.map((entity) => {
        if (entity.id === newProjectile.id) {
          return newProjectile.data();
        }
        return entity;
      });
    }

    default:
      return entities;
  }
};

const checkCollision = (
  shipHitbox: Position[],
  entities: Entity[]
): string | null => {
  const collision = entities.find((entity) => {
    if (entity.type === "ship") {
      const enemy = createShip(entity);
      const enemyHitbox = enemy.getHitbox();
      // Check if any positions in shipHitbox overlap with enemyHitbox
      return shipHitbox.some((shipPosition) =>
        enemyHitbox.some(
          (enemyPosition) =>
            enemyPosition.x === shipPosition.x &&
            enemyPosition.y === shipPosition.y
        )
      );
    }
  });
  return collision ? collision.id : null;
};
