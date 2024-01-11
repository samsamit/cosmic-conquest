import { describe, expect, it } from "bun:test";
import { AppSocket } from "types";
import { BotHandler } from "./bot.handler";
import { ParticipantData } from "controllers/game/game.schema";

describe("BotHandler", () => {
  it("should add bot", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const botToken = "botToken";
    const botHandler = BotHandler();
    const socket = {} as AppSocket;

    // Act
    botHandler.addBot(connectionToken, botToken, socket, null, "botName");

    // Assert
    expect(botHandler.getBot(connectionToken, botToken)).toEqual({
      botToken,
      socket,
      gameId: null,
      connectionToken,
      name: "botName",
    });

    // Adding another bot should throw error
    expect(() =>
      botHandler.addBot(connectionToken, botToken, socket, null, "botName")
    ).toThrow();
  });

  it("should remove bot", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const botToken = "botToken";
    const botHandler = BotHandler();
    const socket = {} as AppSocket;

    // Act
    botHandler.addBot(connectionToken, botToken, socket, null, "botName");
    botHandler.removeBot(connectionToken, botToken);

    // Assert
    expect(botHandler.getBot(connectionToken, botToken)).toBeUndefined();
  });

  it("should set game id", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const participant: ParticipantData = {
      botToken: "botToken",
      teamName: "teamName",
      teamColor: "teamColor",
      name: "name",
    };
    const botHandler = BotHandler();

    // Act
    botHandler.addBot(
      connectionToken,
      participant.botToken,
      {} as AppSocket,
      null,
      "botName"
    );
    botHandler.setGameId("gameId", "token", [participant]);

    // Assert
    expect(botHandler.getBot(connectionToken, participant.botToken)).toEqual({
      botToken: participant.botToken,
      socket: {} as AppSocket,
      gameId: "gameId",
      connectionToken: "connectionToken",
      name: "botName",
    });
  });
});
