import GameManager from "@domain/gameManager";
import Elysia from "elysia";
import { ClientHandler } from "./services/client.handler";
import { BotHandler } from "./services/bot.handler";

export const decorators = (app: Elysia) =>
  app
    .decorate("gameManager", GameManager())
    .decorate("clientHandler", ClientHandler())
    .decorate("botHandler", BotHandler());
