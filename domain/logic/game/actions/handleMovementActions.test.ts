import { describe, it, expect } from "bun:test";
import { Entity } from "../../../models/entities/entity.model";
import {
  EntityAction,
  EntityMoveAction,
} from "../../../models/entities/entityAction.model";
import { handleMovementActions } from "./handleMovementActions";
import { getTestEntity } from "../../../test/test.utils";
import { Projectile } from "../../../models/entities/projectile/projectile.model";

describe("handleMovementActions", () => {
  it("should generate new move actions for entities that did not collide", () => {
    const entities: Entity[] = [
      getTestEntity("1", "ship", "team", { x: 0, y: 0 }),
      getTestEntity("2", "ship", "team", { x: 200, y: 200 }),
    ];
    const actions: EntityMoveAction[] = [
      { type: "move", entityId: "1", distance: 2 },
      { type: "move", entityId: "2", distance: 2 },
    ];
    const newActions = handleMovementActions(entities, actions, 10);
    expect(newActions).toContainEqual({
      type: "move",
      entityId: "1",
      distance: 1,
    } as EntityAction);
    expect(newActions).toContainEqual({
      type: "move",
      entityId: "2",
      distance: 1,
    } as EntityAction);
  });

  it("should generate damage and remove actions for colliding projectiles", () => {
    const testProjectile: Projectile = getTestEntity(
      "1",
      "projectile",
      "team",
      {
        x: 0,
        y: 0,
      }
    ) as Projectile;
    const entities: Entity[] = [
      testProjectile,
      getTestEntity("2", "ship", "team", { x: 0, y: 0 }),
    ];
    const actions: EntityMoveAction[] = [
      { type: "move", entityId: "1", distance: 1 },
    ];
    const newActions = handleMovementActions(entities, actions, 10);
    expect(newActions).toContainEqual({
      type: "damage",
      entityId: "2",
      damage: testProjectile.getDamage(),
    } as EntityAction);
  });

  it("should generate damage and truncated move actions for colliding ships", () => {
    const entities: Entity[] = [
      getTestEntity("1", "ship", "team", { x: 0, y: 0 }),
      getTestEntity("2", "ship", "team", { x: 1, y: 1 }),
    ];
    const actions: EntityMoveAction[] = [
      { type: "move", entityId: "1", distance: 2 },
    ];
    const newActions = handleMovementActions(entities, actions, 10);
    expect(newActions).toContainEqual({
      type: "damage",
      entityId: "1",
      damage: 10,
    } as EntityAction);
    expect(newActions).toContainEqual({
      type: "move",
      entityId: "1",
      distance: 1,
    } as EntityAction);
  });
});
