import { describe, it, expect } from "bun:test";
import {
  getDirectionToMapCenter,
  getInitialShipPositions,
} from "./getInitialShipPositions";
import { CompassDirection } from "../../models/general";

describe("getInitialShipPosition", () => {
  it("should get positions for each ship", () => {
    const shipPositions = getInitialShipPositions(100, 100, 2, [
      { team: 0, ships: ["a", "b"] },
      { team: 1, ships: ["c", "d"] },
    ]);

    expect(shipPositions.length).toBe(4);
    expect(shipPositions[0].shipId).toBe("a");
    expect(shipPositions[1].shipId).toBe("b");
    expect(shipPositions[2].shipId).toBe("c");
    expect(shipPositions[3].shipId).toBe("d");
  });
});

describe("getDirectionToMapCenter", () => {
  const mapWidth = 101;
  const mapHeight = 101;

  it("should return East when position is to the left of the center", () => {
    const position = { x: 0, y: mapHeight / 2 };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.East
    );
  });

  it("should return NorthEast when position is to the bottom left of the center", () => {
    const position = { x: 0, y: mapHeight };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.NorthEast
    );
  });

  it("should return North when position is below the center", () => {
    const position = { x: mapWidth / 2, y: mapHeight };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.North
    );
  });

  it("should return NorthWest when position is to the bottom right of the center", () => {
    const position = { x: mapWidth, y: mapHeight };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.NorthWest
    );
  });

  it("should return West when position is to the right of the center", () => {
    const position = { x: mapWidth, y: mapHeight / 2 };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.West
    );
  });

  it("should return SouthWest when position is to the top right of the center", () => {
    const position = { x: mapWidth, y: 0 };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.SouthWest
    );
  });

  it("should return South when position is above the center", () => {
    const position = { x: mapWidth / 2, y: 0 };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.South
    );
  });

  it("should return SouthEast when position is to the top left of the center", () => {
    const position = { x: 0, y: 0 };
    expect(getDirectionToMapCenter(position, mapWidth, mapHeight)).toBe(
      CompassDirection.SouthEast
    );
  });
});
