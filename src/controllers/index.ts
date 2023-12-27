import Elysia from "elysia";
import { gameController } from "./game/game.controller";
import { clientController } from "./clientSocket/client.controller";
import { botController } from "./botController/bot.controller";

export const controllers = new Elysia()
  .use(gameController)
  .use(clientController)
  .use(botController);
