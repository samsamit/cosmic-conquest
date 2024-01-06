// FILEPATH: /Users/samutiainen/personal/cosmic-conquest/domain/logic/movement/move.test.ts
import { Entity } from "../../models/entities/entity.model";
import { moveEntity } from "./move.logic";
import { describe, expect, it } from "bun:test";
describe("moveEntity", () => {
  it("should move the entity North", () => {
    const entity: Entity = {
      position: { x: 0, y: 0 },
      direction: "North",
    } as Entity;
    const newPos = moveEntity(entity, 1);
    expect(newPos).toStrictEqual({ x: 0, y: -1 });
  });

  it("should move the entity NorthEast", () => {
    const entity: Entity = {
      position: { x: 0, y: 0 },
      direction: "NorthEast",
    } as Entity;
    const newPos = moveEntity(entity, 1);
    expect(newPos).toStrictEqual({ x: 1, y: -1 });
  });

  it("should move the entity East", () => {
    const entity: Entity = {
      position: { x: 0, y: 0 },
      direction: "East",
    } as Entity;
    const newPosition = moveEntity(entity, 1);
    expect(newPosition).toStrictEqual({ x: 1, y: 0 });
  });

  // Add similar tests for SouthEast, South, SouthWest, West, and NorthWest
});
