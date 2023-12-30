import GameManager from "@domain/gameManager";
import Elysia from "elysia";
import { BotHandler } from "services/bot/bot.handler";
import { ClientHandler } from "services/client/client.handler";

export function getServerDecorators(app: Elysia) {
  const gameManager = GameManager();
  const clientHandler = ClientHandler();
  const botHandler = BotHandler();

  gameManager.runGameLoop((gameId) => {
    botHandler.sendGameState(gameId);
  });
  return app
    .decorate("gameManager", gameManager)
    .decorate("clientHandler", clientHandler)
    .decorate("botHandler", botHandler);
}
