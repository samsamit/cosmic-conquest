import { Participant } from "../../../domain/gameInstance/gameInstance.model";
import { Direction, Position } from "../../../domain/general.schema";
import { getDirectionToCenter } from "../../direction/direction.logic";

export const getStartingPositionsForTeams = (
  participants: Participant[],
  mapWidth: number,
  mapHeight: number,
  shipSize: number
): (Participant & {
  position: Position;
  direction: Direction;
})[] => {
  const possiblePositions = getPositionsAroundTheMap(
    mapWidth,
    mapHeight,
    shipSize
  );
  const teams = groupByTeam(participants);
  const teamPositions = divideArray(possiblePositions, teams.size);
  const allBotPositions: (Participant & {
    position: Position;
    direction: Direction;
  })[] = [];
  [...teams.values()].forEach((team, index) => {
    const positions = teamPositions[index];
    const botPositions = team.map((bot) => {
      if (positions.length === 0) {
        throw new Error("Not enough positions");
      }
      const randomPosition =
        positions[Math.floor(Math.random() * positions.length)];
      const position = positions.splice(
        positions.indexOf(randomPosition),
        1
      )[0];
      return {
        ...bot,
        position,
        direction: getDirectionToCenter(position, mapWidth, mapHeight),
      };
    });
    allBotPositions.push(...botPositions);
  });
  return allBotPositions;
};

const divideArray = <T>(array: T[], partitions: number): T[][] => {
  const result: T[][] = [];
  const partitionSize = Math.ceil(array.length / partitions);
  for (let i = 0; i < array.length; i += partitionSize) {
    result.push(array.slice(i, i + partitionSize));
  }
  return result;
};

const getPositionsAroundTheMap = (
  mapWidth: number,
  mapHeight: number,
  shipSize: number
): Position[] => {
  const topY = shipSize;
  const bottomY = mapHeight - shipSize;
  const leftX = shipSize;
  const rightX = mapWidth - shipSize;
  const possiblePositions: Position[] = [];
  for (let y = topY; y <= bottomY; y = y + shipSize) {
    possiblePositions.push({ x: leftX, y });
  }
  for (let y = topY; y <= bottomY; y = y + shipSize) {
    possiblePositions.push({ x: rightX, y });
  }
  for (let x = leftX; x <= rightX; x = x + shipSize) {
    possiblePositions.push({ x, y: topY });
  }
  for (let x = leftX; x <= rightX; x = x + shipSize) {
    possiblePositions.push({ x, y: bottomY });
  }
  return possiblePositions;
};

const groupByTeam = (participants: Participant[]) => {
  const teams = new Map<string, Participant[]>();
  for (const participant of participants) {
    const team = teams.get(participant.teamName);
    if (team) {
      team.push(participant);
    } else {
      teams.set(participant.teamName, [participant]);
    }
  }
  return teams;
};
