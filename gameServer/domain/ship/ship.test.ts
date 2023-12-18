import { beforeEach, describe, expect, test } from "bun:test";
import { createShip } from "./ship.model";
import { ShipData } from "./ship.schema";

describe("Ship", () => {
  let shipData: ShipData;

  beforeEach(() => {
    shipData = {
      id: "1",
      position: { x: 0, y: 0 },
      direction: "N",
      health: { current: 100, max: 100 },
      heat: { current: 0, max: 100 },
      vision: 10,
      hitboxRadius: 5,
    };
  });

  test("should create a ship with the provided data", () => {
    const ship = createShip(shipData);
    expect(ship.data()).toEqual(shipData);
  });

  test("should calculate the hitbox correctly", () => {
    const ship = createShip(shipData);
    const hitbox = ship.getHitbox();
    expect(hitbox).toHaveLength(shipData.hitboxRadius * shipData.hitboxRadius);
  });

  test("should move the ship correctly", () => {
    const ship = createShip(shipData);
    const movedShip = ship.move(10);
    expect(movedShip.position).not.toEqual(ship.position);
  });

  test("should turn the ship correctly", () => {
    const ship = createShip(shipData);
    const turnedShip = ship.turn("S");
    expect(turnedShip.direction).toBe("S");
  });

  test("should calculate the projectile position correctly", () => {
    const ship = createShip(shipData);
    const projectilePosition = ship.getProjectilePosition(1);
    expect(projectilePosition).not.toEqual(ship.position);
  });

  test("should deal damage correctly", () => {
    const ship = createShip(shipData);
    const damagedShip = ship.dealDamage(10);
    expect(damagedShip.health.current).toBe(ship.health.current - 10);
  });
});
