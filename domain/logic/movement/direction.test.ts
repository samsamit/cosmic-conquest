// FILEPATH: /Users/samutiainen/personal/cosmic-conquest/domain/logic/movement/direction.test.ts
import { Entity } from "../../models/entities/entity.model";
import { CompassDirection } from "../../models/general";
import { getDistanceBetweenPositions, turnEntity } from "./direction.logic";
import { describe, expect, it } from "bun:test";
describe("turnEntity", () => {
  it("should turn the entity to the right", () => {
    const entity: Entity = { direction: "North" } as Entity;
    const newDirection = turnEntity(entity, "right");
    expect(newDirection).toBe("NorthEast");
  });

  it("should turn the entity to the left", () => {
    const entity: Entity = { direction: "North" } as Entity;
    const newDirection = turnEntity(entity, "left");
    expect(newDirection).toBe("NorthWest");
  });

  it("should wrap around to North when turning right from NorthWest", () => {
    const entity: Entity = { direction: "NorthWest" } as Entity;
    const newDirection = turnEntity(entity, "right");
    expect(newDirection).toBe("North");
  });

  it("should wrap around to NorthWest when turning left from North", () => {
    const entity: Entity = { direction: "North" } as Entity;
    const newDirection = turnEntity(entity, "left");
    expect(newDirection).toBe("NorthWest");
  });
});

describe("getDistanceBetweenEntities", () => {
  it("should return the distance between two entities", () => {
    const origin = { x: 0, y: 0 };
    const target = { x: 3, y: 0 };
    const distance = getDistanceBetweenPositions(origin, target);
    expect(distance).toBe(3);
  });
  it("should return the distance between two entities with angle", () => {
    const origin = { x: 0, y: 0 };
    const target = { x: 3, y: 4 };
    const distance = getDistanceBetweenPositions(origin, target);
    expect(distance).toBe(5);
  });
  it("should return the distance between two entities with uneven distance", () => {
    const origin = { x: 0, y: 0 };
    const target = { x: 3, y: 5 };
    const distance = getDistanceBetweenPositions(origin, target);
    expect(distance).toBe(6);
  });
});
