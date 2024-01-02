import { Entity } from "../../models/entities/entity.model";
import { Ship } from "../../models/entities/ship/ship.model";
import { CompassDirection, Position } from "../../models/general";
import { HiddenTile, Tile } from "../../models/map.model";
import {
  findSignalPosition,
  getDistanceBetweenPositions,
} from "../movement/direction.logic";

export const getGameMap = (
  entities: Entity[],
  mapWidth: number,
  mapHeight: number
) => {
  const ships = entities.filter(
    (entity): entity is Ship => entity.type === "ship"
  );
  const map: Tile[][] = [];
  for (let y = 0; y < mapHeight; y++) {
    map[y] = [];
    for (let x = 0; x < mapWidth; x++) {
      map[y][x] = { type: "empty" };
    }
  }

  entities.forEach((entity) => {
    switch (entity.type) {
      case "ship": {
        const ship = entity;
        const shipHitBoxes = ship.getHitboxPositions();
        map[ship.position.y][ship.position.x] = {
          type: "ship",
          id: ship.id,
          direction: CompassDirection[
            ship.direction
          ] as keyof typeof CompassDirection,
        };
        shipHitBoxes.forEach((hitbox) => {
          map[hitbox.y][hitbox.x] = { type: "hitbox" };
        });

        const enemyShips = ships.filter(
          (enemyShip) =>
            enemyShip.team !== ship.team &&
            getDistanceBetweenPositions(ship.position, enemyShip.position) >
              ship.visionRange
        );
        enemyShips.forEach((enemyShip) => {
          const signalPosition = findSignalPosition(
            ship.position,
            enemyShip.position,
            ship.visionRange
          );
          const currentTile = map[signalPosition.y][signalPosition.x];
          if (currentTile.type === "empty" || currentTile.type === "hidden") {
            map[signalPosition.y][signalPosition.x] = { type: "signal" };
          }
        });
        break;
      }

      case "projectile": {
        const projectile = entity;
        const projectileHitBox = projectile.getHitboxPositions();
        map[projectile.position.y][projectile.position.x] = {
          type: "projectile",
          id: projectile.id,
          direction: CompassDirection[
            projectile.direction
          ] as keyof typeof CompassDirection,
        };
        projectileHitBox.forEach((hitbox) => {
          map[hitbox.y][hitbox.x] = { type: "hitbox" };
        });
        break;
      }
      case "explosion": {
        const explosion = entity;
        map[explosion.position.y][explosion.position.x] = {
          type: "explosion",
        };
        break;
      }
    }
  });

  return map;
};

export const getTeamsMap = (teamShips: Ship[], gameMap: Tile[][]): Tile[][] => {
  const visionPositions: Position[] = [];
  teamShips.forEach((ship) => {
    const shipVisionPositions = getVisionPositions(
      ship.position,
      ship.visionRange
    );
    visionPositions.push(...shipVisionPositions);
  });
  return gameMap.map((row, y) => {
    return row.map((tile, x) => {
      const visionPosition = visionPositions.find(
        (position) => position.x === x && position.y === y
      );
      if (visionPosition) {
        return tile;
      }
      if (tile.type === "projectile") {
        return tile;
      }
      return { type: "hidden" } satisfies HiddenTile;
    });
  });
};

export const getVisionPositions = (position: Position, visionRange: number) => {
  const visionPositions: Position[] = [];

  for (let dx = -visionRange; dx <= visionRange; dx++) {
    for (let dy = -visionRange; dy <= visionRange; dy++) {
      const x = position.x + dx;
      const y = position.y + dy;
      if (getDistanceBetweenPositions(position, { x, y }) <= visionRange) {
        visionPositions.push({ x, y });
      }
    }
  }

  return visionPositions;
};
