import { expect, test, describe, it, beforeEach } from "bun:test";
import GameManager from ".";
import { Participant } from "../types";

describe("GameManager", () => {
  let gameManager: GameManager;
  beforeEach(() => {
    gameManager = GameManager();
  });

  it("should be able to create a game", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    expect(newGameManager.games.size).toEqual(1);
  });

  it("should be able to get a game", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    const game = newGameManager.get("id");
    expect(game).toBeDefined();
  });

  it("should be able to set a game", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    const newGame = newGameManager.set("id", newGameManager.get("id"));
    expect(newGame).toBeDefined();
  });

  it("should be able to delete a game", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    const newGame = newGameManager.delete("id");
    expect(newGame).toBeDefined();
  });

  it("should be able to add an action to a game", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    const newGame = newGameManager.addAction("id", {
      action: "move",
      botToken: "test",
      distance: 1,
    });
    expect(newGame).toBeDefined();
  });

  it("should be able to get a game by botToken", () => {
    const participants: Participant[] = [
      {
        botToken: "test",
        teamColor: "test",
        teamName: "test",
      },
    ];
    const newGameManager = gameManager.createGame({ id: "id", participants });
    const gameId = newGameManager.getBotsGameID("test");
    expect(gameId).toEqual("id");
  });
});
