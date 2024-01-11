import { edenTreaty } from "@elysiajs/eden";
import { type App } from "../../server";
import { describe, it, expect } from "bun:test";
import { Participant } from "@domain/types";

const testApi = edenTreaty<App>("http://localhost:3000");

describe("gameController", () => {
  describe("POST /game/:gameId/create", () => {
    it("should create a game", async () => {
      const participants: Participant[] = [
        {
          botToken: "1",
          teamColor: "red",
          teamName: "red team",
          name: "red bot",
        },
        {
          botToken: "2",
          teamColor: "blue",
          teamName: "blue team",
          name: "blue bot",
        },
      ];
      const response = await testApi.game["1"].create.post({
        participants,
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /game/:gameId/state", () => {
    it("should update the game state", async () => {
      const response = await testApi.game["1"].state.post({ state: "START" });

      expect(response.status).toBe(200);
    });
  });
});
