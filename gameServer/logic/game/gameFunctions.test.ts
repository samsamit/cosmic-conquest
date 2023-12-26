import { describe, test } from "bun:test";
import { Participant } from "../../domain/gameInstance/gameInstance.model";
import { getStartingPositionsForTeams } from "./functions/getStartingPositions";

describe("gameFunctions", () => {
  test("get good starting positions", () => {
    const mapWidth = 100;
    const mapHeight = 100;
    const shipSize = 3;
    const teamBots: Participant[] = [
      {
        botToken: "1",
        teamName: "1",
        teamColor: "red",
      },
      {
        botToken: "2",
        teamName: "1",
        teamColor: "red",
      },
      {
        botToken: "3",
        teamName: "1",
        teamColor: "red",
      },
      {
        botToken: "4",
        teamName: "2",
        teamColor: "blue",
      },
      {
        botToken: "5",
        teamName: "2",
        teamColor: "blue",
      },
      {
        botToken: "6",
        teamName: "2",
        teamColor: "blue",
      },
    ];

    const startingPostions = getStartingPositionsForTeams(
      teamBots,
      mapWidth,
      mapHeight,
      shipSize
    );
    console.log(startingPostions);
  });
});
