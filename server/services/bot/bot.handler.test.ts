import { describe, expect, it } from "bun:test";
import { AppSocket } from "types";
import { BotHandler } from "./bot.handler";

describe("BotHandler", () => {
  it("should add bot", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const botToken = "botToken";
    const botHandler = BotHandler();
    const socket = {} as AppSocket;

    // Act
    botHandler.addBot(connectionToken, botToken, socket, null);

    // Assert
    expect(botHandler.getBot(connectionToken, botToken)).toEqual({
      botToken,
      socket,
      gameId: null,
    });

    // Adding another bot should throw error
    expect(() =>
      botHandler.addBot(connectionToken, botToken, socket, null)
    ).toThrow();
  });

  it("should remove bot", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const botToken = "botToken";
    const botHandler = BotHandler();
    const socket = {} as AppSocket;

    // Act
    botHandler.addBot(connectionToken, botToken, socket, null);
    botHandler.removeBot(connectionToken, botToken);

    // Assert
    expect(botHandler.getBot(connectionToken, botToken)).toBeUndefined();
  });

  it("should set game id", () => {
    // Arrange
    const connectionToken = "connectionToken";
    const botToken = "botToken";
    const botHandler = BotHandler();

    // Act
    botHandler.addBot(connectionToken, botToken, {} as AppSocket, null);
    botHandler.setGameId("gameId", [botToken]);

    // Assert
    expect(botHandler.getBot(connectionToken, botToken)).toEqual({
      botToken,
      socket: {} as AppSocket,
      gameId: "gameId",
    });
  });
});
