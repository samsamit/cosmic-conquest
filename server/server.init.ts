import GameManager from "@domain/gameManager";
import Elysia from "elysia";
import { BotHandler } from "services/bot/bot.handler";
import { ClientHandler } from "services/client/client.handler";

export function getServerDecorators(app: Elysia) {
  const gameManager = GameManager();
  const clientHandler = ClientHandler();
  const botHandler = BotHandler();

  gameManager.runGameLoop((update) => {
    const { id, gameMap, teamMaps } = update;
    botHandler.sendGameState(id, teamMaps);
  });
  return app
    .decorate("gameManager", gameManager)
    .decorate("clientHandler", clientHandler)
    .decorate("botHandler", botHandler);
}
