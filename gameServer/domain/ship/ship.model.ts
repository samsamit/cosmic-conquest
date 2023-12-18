import { Direction, Position } from "../general.schema";
import { ShipData } from "./ship.schema";
import { getForwardPosition } from "../../logic/movement/movement.logic";

export interface Ship extends ShipData {
  getHitbox(): Position[];
  move(distance: number): Ship;
  turn(direction: Direction): Ship;
  getProjectilePosition(projectileHitboxRadius: number): Position;
  dealDamage(damage: number): Ship;
  data(): ShipData;
}

export const createShip = (data: ShipData): Ship => ({
  ...data,
  getHitbox() {
    const { hitboxRadius } = this;
    const hitbox: Position[] = [];
    for (let x = 0; x < hitboxRadius; x++) {
      for (let y = 0; y < hitboxRadius; y++) {
        hitbox.push({ x: x + this.position.x, y: y + this.position.y });
      }
    }
    return hitbox;
  },
  move(distance) {
    const newPos = getForwardPosition(this.position, this.direction, distance);
    return { ...this, position: newPos };
  },
  turn(direction) {
    return { ...this, direction };
  },
  getProjectilePosition(projectileHitboxRadius) {
    const { hitboxRadius } = this;
    const projectileOffset = hitboxRadius + projectileHitboxRadius;
    return getForwardPosition(this.position, this.direction, projectileOffset);
  },
  dealDamage(damage) {
    const { health } = this;
    const newHealth = health.current - damage;
    return { ...this, health: { ...health, current: newHealth } };
  },
  data() {
    return {
      id: this.id,
      position: this.position,
      direction: this.direction,
      health: this.health,
      heat: this.heat,
      vision: this.vision,
      hitboxRadius: this.hitboxRadius,
    };
  },
});
