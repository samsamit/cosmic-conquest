import { describe, it, expect } from "bun:test";
import { Entity } from "../../../models/entities/entity.model";
import { EntityAction } from "../../../models/entities/entityAction.model";
import { runEntityActions } from "./runEntityActions";
import { getTestEntity } from "../../../test/test.utils";
import { Ship } from "../../../models/entities/ship/ship.model";
import { CompassDirection } from "../../../models/general";

describe("runEntityActions", () => {
  it("should correctly handle move actions", () => {
    const testShip = getTestEntity("1", "ship", "team", { x: 0, y: 0 });
    const entities: Entity[] = [testShip];
    const actions: EntityAction[] = [
      { type: "move", entityId: "1", distance: 1 },
    ];
    const result = runEntityActions(actions, entities);
    expect(result).toHaveLength(1);
    expect(result[0].position).toEqual({ x: 1, y: 0 });
  });

  it("should correctly handle turn actions", () => {
    const testShip = getTestEntity("1", "ship", "team", { x: 0, y: 0 });
    const entities: Entity[] = [testShip];
    const actions: EntityAction[] = [
      { type: "turn", entityId: "1", direction: "right" },
    ];
    const result = runEntityActions(actions, entities);
    expect(result).toHaveLength(1);
    expect((result[0] as Ship).direction).toBe(CompassDirection.SouthEast);
  });

  it("should correctly handle shoot actions", () => {
    const testShip = getTestEntity("1", "ship", "team", { x: 0, y: 0 }) as Ship;
    const entities: Entity[] = [testShip];
    const actions: EntityAction[] = [
      { type: "shoot", entityId: "1", mass: 1, speed: 1 },
    ];
    const result = runEntityActions(actions, entities);

    const expectedProjectile = testShip.shoot(1, 1);
    expect(result).toHaveLength(2);
    const foundProjectile = result.find(
      (e) =>
        e.position.x === expectedProjectile.position.x &&
        e.position.y === expectedProjectile.position.y
    );
    expect(foundProjectile).toBeDefined();
  });

  it("should correctly handle damage actions", () => {
    const testShip = getTestEntity("1", "ship", "team", { x: 0, y: 0 });
    const entities: Entity[] = [testShip];
    const actions: EntityAction[] = [
      { type: "damage", entityId: "1", damage: 5 },
    ];
    const result = runEntityActions(actions, entities);
    expect(result).toHaveLength(1);
    expect((result[0] as Ship).health).toBe(5);
  });

  it("should correctly handle explode actions", () => {
    const actions: EntityAction[] = [
      { type: "explode", position: { x: 0, y: 0 } },
    ];
    const result = runEntityActions(actions, []);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("explosion");
  });
});
