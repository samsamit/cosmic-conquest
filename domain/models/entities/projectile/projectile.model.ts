import { turnEntity } from "../../../logic/movement/direction.logic";
import { moveEntity } from "../../../logic/movement/move.logic";
import { Position } from "../../general";
import { EntityData, EntityFunctions } from "../entity.model";

export interface ProjectileData extends EntityData {
  type: "projectile";
  speed: number;
  mass: number;
}

export interface Projectile extends ProjectileData, EntityFunctions {
  getDamage: () => number;
}

export const createProjectile = (
  projectileData: Omit<ProjectileData, "type" | "hitboxRadius">
): Projectile => ({
  ...projectileData,
  type: "projectile",
  hitboxRadius: 0,
  move(distance) {
    this.position = moveEntity(this, distance);
    return this;
  },
  turn(direction) {
    this.direction = turnEntity(this, direction);
    return this;
  },
  getHitboxPositions() {
    const hitboxPositions: Position[] = [];
    for (
      let x = this.position.x - this.hitboxRadius;
      x <= this.position.x + this.hitboxRadius;
      x++
    ) {
      for (
        let y = this.position.y - this.hitboxRadius;
        y <= this.position.y + this.hitboxRadius;
        y++
      ) {
        if (x === this.position.x && y === this.position.y) continue;
        hitboxPositions.push({ x, y });
      }
    }
    return hitboxPositions;
  },
  getDamage() {
    return this.speed * this.mass;
  },
});
