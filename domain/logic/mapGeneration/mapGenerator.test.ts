import { getGameMap, getTeamsMap } from "./mapGenerator";
import { Tile } from "../../models/map.model";
import { describe, it, expect } from "bun:test";
import { Entity } from "../../models/entities/entity.model";
import { Ship } from "../../models/entities/ship/ship.model";
import { getTestEntity } from "../../test/test.utils";

describe("getGameMap", () => {
  it("should generate a game map with correct dimensions", () => {
    const entities: Entity[] = [];
    const mapWidth = 10;
    const mapHeight = 5;
    const map = getGameMap(entities, mapWidth, mapHeight);
    expect(map.length).toBe(mapHeight);
    expect(map[0].length).toBe(mapWidth);
  });

  // Add more tests here to check the placement of ships, projectiles, and explosions on the map
});

describe("getTeamsMap", () => {
  it("should generate a teams map with correct dimensions", () => {
    const teamShips: Ship[] = [];
    const gameMap: Tile[][] = [
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
    ];
    const expectedTeamMap: Tile[][] = [
      [{ type: "hidden" }, { type: "hidden" }],
      [{ type: "hidden" }, { type: "hidden" }],
      [{ type: "hidden" }, { type: "hidden" }],
    ];
    const teamsMap = getTeamsMap(teamShips, gameMap);
    expect(teamsMap.length).toBe(gameMap.length);
    expect(teamsMap[0].length).toBe(gameMap[0].length);
    expect(teamsMap).toStrictEqual(expectedTeamMap);
  });

  it("should keep the ships vision tiles visible", () => {
    const teamShips: Ship[] = [
      getTestEntity("ship", "ship", "team1", { x: 0, y: 0 }, 1) as Ship,
    ];

    const gameMap: Tile[][] = [
      [{ type: "ship", direction: "East", id: "ship" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
      [
        { type: "projectile", direction: "East", id: "p" },
        { type: "ship", direction: "East", id: "enemy" },
      ],
    ];

    const expectedTeamMap: Tile[][] = [
      [{ type: "ship", direction: "East", id: "ship" }, { type: "empty" }],
      [{ type: "empty" }, { type: "empty" }],
      [{ type: "hidden" }, { type: "hidden" }],
      [{ type: "projectile", direction: "East", id: "p" }, { type: "hidden" }],
    ];

    const teamsMap = getTeamsMap(teamShips, gameMap);
    expect(teamsMap.length).toBe(gameMap.length);
    expect(teamsMap[0].length).toBe(gameMap[0].length);
    expect(teamsMap).toStrictEqual(expectedTeamMap);
  });
});
