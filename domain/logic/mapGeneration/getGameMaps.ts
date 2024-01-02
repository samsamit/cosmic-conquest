import { getGameMap, getTeamsMap } from "./mapGenerator";
import { Entity } from "../../models/entities/entity.model";
import { Ship } from "../../models/entities/ship/ship.model";
import { Tile } from "../../models/map.model";
import { GameSettings } from "../../models/game/gameSettings.model";

export interface GameTeamMap {
  shipIds: string[];
  map: Tile[][];
}

export const getGameMaps = (entities: Entity[], gameSettings: GameSettings) => {
  const gameMap = getGameMap(
    entities,
    gameSettings.mapWidth,
    gameSettings.mapHeight
  );
  const teams = entities
    .filter((e): e is Ship => e.type === "ship")
    .reduce<Record<string, Ship[]>>((acc, e) => {
      if (!acc[e.team]) {
        acc[e.team] = [];
      }
      acc[e.team].push(e);
      return acc;
    }, {});
  const teamMaps: GameTeamMap[] = Object.values(teams).map<GameTeamMap>(
    (ships) => ({
      shipIds: ships.map((s) => s.id),
      map: getTeamsMap(ships, gameMap),
    })
  );
  return {
    map: gameMap,
    teamMaps,
  };
};
