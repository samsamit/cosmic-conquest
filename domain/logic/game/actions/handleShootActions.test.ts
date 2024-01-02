import { describe, it, expect } from "bun:test";
import { Entity } from "../../../models/entities/entity.model";
import { EntityShootAction } from "../../../models/entities/entityAction.model";
import { handleShootActions } from "./handleShootActions";
import { getTestEntity } from "../../../test/test.utils";
import { CompassDirection } from "../../../models/general";
import { createProjectile } from "../../../models/entities/projectile/projectile.model";
import { Ship } from "../../../models/entities/ship/ship.model";

describe("handleShootActions", () => {
  it("should throw an error if the shooting entity is not found", () => {
    const actions: EntityShootAction[] = [
      { type: "shoot", entityId: "1", mass: 1, speed: 1 },
    ];
    const entities: Entity[] = [];
    expect(() => handleShootActions(actions, entities)).toThrow(
      "Entity with id 1 not found"
    );
  });

  it("should create a projectile and add it to createdEntities if there are no collisions", () => {
    const actions: EntityShootAction[] = [
      { type: "shoot", entityId: "1", mass: 1, speed: 1 },
    ];
    const testShip = getTestEntity("1", "ship", "team", { x: 0, y: 0 });
    const entities: Entity[] = [testShip];
    const result = handleShootActions(actions, entities);
    expect(result).toHaveLength(1);
    expect(result[0].entityId).toBe("1");
  });

  it("should create damage and explode actions if there are collisions", () => {
    const testShip = getTestEntity("1", "ship", "team1", {
      x: 0,
      y: 0,
    }) as Ship;
    const testShip2 = getTestEntity("2", "ship", "team2", {
      x: 3,
      y: 0,
    }) as Ship;
    const actions: EntityShootAction[] = [
      { type: "shoot", entityId: "1", mass: 1, speed: 1 },
    ];
    const projectileDamage = createProjectile({
      position: { x: 1, y: 0 },
      direction: CompassDirection.East,
      id: "1",
      mass: 1,
      speed: 1,
    }).getDamage();
    const entities: Entity[] = [testShip, testShip2];
    const result = handleShootActions(actions, entities);
    expect(result).toContainEqual({
      type: "damage",
      entityId: "2",
      damage: projectileDamage,
    });
    expect(result).toContainEqual({
      type: "explode",
      position: { x: 2, y: 0 },
    });
  });
});
