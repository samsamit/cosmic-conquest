import { CompassDirection, Position } from "../../models/general";
import { Participant } from "../../types";

interface ShipPositionData {
  shipId: string;
  team: string;
  teamColor: string;
  position: Position;
}

export const getInitialShipPositions = (
  mapWidth: number,
  mapHeight: number,
  shipHitboxRadius: number,
  participants: Participant[]
): Array<ShipPositionData> => {
  const teamsAndShips = Object.values(
    participants.reduce<
      Record<string, { team: string; teamColor: string; ships: string[] }>
    >((acc, participant) => {
      const team = participant.teamName;
      if (acc[team]) {
        acc[team].ships.push(participant.botToken);
      } else {
        acc[team] = {
          team,
          teamColor: participant.teamColor,
          ships: [participant.botToken],
        };
      }
      return acc;
    }, {} satisfies Record<string, { team: string; ships: string[] }>)
  );
  const shipPositions: ShipPositionData[] = [];
  const edgeMargin = shipHitboxRadius + 1; // Define how close to the edge the ship can spawn
  function getSpawnPoints(
    mapWidth: number,
    mapHeight: number,
    edgeMargin: number
  ) {
    const spawnPoints: Position[] = [];
    // Left
    for (let y = edgeMargin; y < mapHeight - edgeMargin; y++) {
      spawnPoints.push({ x: edgeMargin, y });
    }
    // Top
    for (let x = edgeMargin; x < mapWidth - edgeMargin; x++) {
      spawnPoints.push({ x, y: edgeMargin });
    }
    // Right
    for (let y = edgeMargin; y < mapHeight - edgeMargin; y++) {
      spawnPoints.push({ x: mapWidth - edgeMargin, y });
    }
    // Bottom
    for (let x = edgeMargin; x < mapWidth - edgeMargin; x++) {
      spawnPoints.push({ x, y: mapHeight - edgeMargin });
    }

    return spawnPoints;
  }

  function divideSpawnPointsByTeamCount(
    spawnPoints: Position[],
    teamCount: number
  ) {
    const spawnPointsPerTeam = Math.floor(spawnPoints.length / teamCount);
    const spawnPointsByTeam: Position[][] = [];
    for (let i = 0; i < teamCount; i++) {
      spawnPointsByTeam.push(spawnPoints.splice(0, spawnPointsPerTeam));
    }
    return spawnPointsByTeam;
  }
  const spawnPoints = getSpawnPoints(mapWidth, mapHeight, edgeMargin);
  const spawnPointsByTeam = divideSpawnPointsByTeamCount(
    spawnPoints,
    teamsAndShips.length
  );

  teamsAndShips.forEach((teamAndShips, teamIndex) => {
    const teamPositions = spawnPointsByTeam[teamIndex];
    const roomForShips = teamAndShips.ships.length * (shipHitboxRadius * 2 + 1);
    if (roomForShips > teamPositions.length) {
      throw new Error(
        `Not enough spawn points for team ${teamIndex} to spawn all ships`
      );
    }
    const randomStart = Math.floor(
      Math.random() * (spawnPointsByTeam[teamIndex].length - roomForShips)
    );

    const positions = teamPositions.splice(randomStart, roomForShips);
    positions.splice(0, shipHitboxRadius);
    positions.splice(-shipHitboxRadius, shipHitboxRadius);
    const positionsByShip = positions.filter(
      (_, i) => i % shipHitboxRadius === 0
    );
    teamAndShips.ships.forEach((shipId, shipIndex) => {
      shipPositions.push({
        shipId,
        position: positionsByShip[shipIndex],
        team: teamAndShips.team,
        teamColor: teamAndShips.teamColor,
      });
    });
  });

  return shipPositions;
};

export const getDirectionToMapCenter = (
  position: Position,
  mapWidth: number,
  mapHeight: number
): CompassDirection => {
  const center = {
    x: mapWidth / 2,
    y: mapHeight / 2,
  };
  const xDistance = center.x - position.x;
  const yDistance = center.y - position.y;

  const angle = Math.atan2(yDistance, xDistance);
  const degree = ((angle * 180) / Math.PI + 360) % 360;

  if (degree >= 337.5 || degree < 22.5) {
    return "East";
  } else if (degree >= 22.5 && degree < 67.5) {
    return "SouthEast";
  } else if (degree >= 67.5 && degree < 112.5) {
    return "South";
  } else if (degree >= 112.5 && degree < 157.5) {
    return "SouthWest";
  } else if (degree >= 157.5 && degree < 202.5) {
    return "West";
  } else if (degree >= 202.5 && degree < 247.5) {
    return "NorthWest";
  } else if (degree >= 247.5 && degree < 292.5) {
    return "North";
  } else {
    return "NorthEast";
  }
};
