import { describe, expect, it } from "bun:test";
import { ClientHandler } from "./client.handler";

describe("ClientHandler", () => {
  it("should add a client", () => {
    const clientHandler = ClientHandler();
    clientHandler.addClient("userConnectionToken", {} as any);
    expect(clientHandler.clients.size).toBe(1);
  });

  it("should remove a client", () => {
    const clientHandler = ClientHandler();
    clientHandler.addClient("userConnectionToken", {} as any);
    clientHandler.removeClient("userConnectionToken");
    expect(clientHandler.clients.size).toBe(0);
  });

  it("should get a client", () => {
    const clientHandler = ClientHandler();
    clientHandler.addClient("userConnectionToken", {} as any);
    const client = clientHandler.getClient("userConnectionToken");
    expect(client).toBeDefined();
  });

  it("should not get a client", () => {
    const clientHandler = ClientHandler();
    const client = clientHandler.getClient("userConnectionToken");
    expect(client).toBeUndefined();
  });
});
