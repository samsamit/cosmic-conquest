import { nanoid } from "nanoid";
import { getForwardPosition } from "../../logic/movement/movement.logic";
import { Direction, Position } from "../general.schema";
import { ProjectileData } from "./projectile.schema";

interface Projectile extends ProjectileData {
  move(distance: number): Projectile;
  getHitbox(): Position[];
  data(): ProjectileData;
  damage(): number;
}

interface ProjectileConstructor {
  type: "projectile" | "asteroid";
  position: Position;
  direction: Direction;
  speed: number;
  mass: number;
}
export const createProjectile = ({
  position,
  direction,
  speed,
  mass,
  type,
}: ProjectileConstructor): Projectile => ({
  type,
  id: nanoid(),
  position,
  direction,
  speed,
  mass,
  move(distance) {
    const newPos = getForwardPosition(this.position, this.direction, distance);
    return { ...this, position: newPos };
  },
  getHitbox() {
    const { mass } = this;
    const radius = convertMassToRadius(mass);
    const hitbox: Position[] = [];
    for (let x = 0; x < radius; x++) {
      for (let y = 0; y < radius; y++) {
        hitbox.push({ x: x + this.position.x, y: y + this.position.y });
      }
    }
    return hitbox;
  },
  damage() {
    return this.mass + this.speed;
  },
  data() {
    return {
      type: this.type,
      id: this.id,
      position: this.position,
      direction: this.direction,
      speed: this.speed,
      mass: this.mass,
    };
  },
});

const convertMassToRadius = (mass: number): number => {
  return mass;
};
