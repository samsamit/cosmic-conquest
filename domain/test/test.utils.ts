import { Entity } from "../models/entities/entity.model";
import { createProjectile } from "../models/entities/projectile/projectile.model";
import { createShip } from "../models/entities/ship/ship.model";
import { CompassDirection, Position } from "../models/general";

export const getTestEntity = (
  id: string,
  type: Entity["type"],
  team: string,
  position: Position,
  visionRange = 1,
  direction: CompassDirection = CompassDirection.East
): Entity => {
  switch (type) {
    case "ship":
      return createShip({
        id,
        position,
        direction: direction,
        hitboxRadius: 1,
        health: 10,
        visionRange,
        team,
      });
    case "projectile":
      return createProjectile({
        id,
        position,
        direction: direction,
        speed: 1,
        mass: 1,
      });
    case "explosion":
      return {
        id,
        type: "explosion",
        position,
      };
  }
};
