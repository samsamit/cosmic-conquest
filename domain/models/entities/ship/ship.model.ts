import { turnEntity } from "../../../logic/movement/direction.logic";
import { moveEntity } from "../../../logic/movement/move.logic";
import { Position } from "../../general";
import { BaseEntityData, EntityFunctions } from "../entity.model";
import { Projectile, createProjectile } from "../projectile/projectile.model";

export interface ShipData extends BaseEntityData {
  type: "ship";
  team: string;
  health: number;
  maxHealth: number;
  visionRange: number;
}

export interface Ship extends ShipData, EntityFunctions {
  getProjectilePosition: () => Position;
  dealDamage: (damage: number) => Ship;
  shoot: (mass: number, speed: number) => Projectile;
}

export const createShip = (
  shipData: Omit<ShipData, "type" | "maxHealth">
): Ship => {
  const ship: Ship = {
    ...shipData,
    type: "ship",
    maxHealth: shipData.health,
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
    getProjectilePosition() {
      return moveEntity(this, this.hitboxRadius + 1);
    },
    dealDamage(damage) {
      this.health -= damage;
      return this;
    },
    shoot(mass, speed) {
      return createProjectile({
        position: this.getProjectilePosition(),
        direction: this.direction,
        id: crypto.randomUUID(),
        mass,
        speed,
      });
    },
    data() {
      return {
        id: this.id,
        position: this.position,
        direction: this.direction,
        hitboxRadius: this.hitboxRadius,
        maxHealth: this.maxHealth,
        team: this.team,
        health: this.health,
        visionRange: this.visionRange,
        type: "ship",
      };
    },
  };
  return ship;
};
