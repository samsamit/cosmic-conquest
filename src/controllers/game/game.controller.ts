import { Elysia } from "elysia";
import { setGameStateSchema, startGameSchema } from "./game.schema";
import { GameState } from "@domain/models/game/game.model";
import { decorators } from "src/server.plugins";

export const gameController = new Elysia()
  .use(decorators)
  .group("/game/:gameId", (app) =>
    app
      .post(
        "/create",
        ({ gameManager, body, params: { gameId } }) =>
          gameManager.createGame({
            id: gameId,
            participants: body.participants,
          }),
        {
          body: startGameSchema,
        }
      )
      .post(
        "/state",
        ({ gameManager, body, params: { gameId } }) => {
          let game = gameManager.get(gameId);
          switch (body.state) {
            case "START":
              game = game.setState(GameState.RUNNING);
              break;
            case "PAUSE":
              game = game.setState(GameState.PAUSED);
              break;
            case "STOP":
              game = game.setState(GameState.STOPPED);
              break;
            default:
              return new Response("Invalid state", { status: 400 });
          }
          gameManager.set(gameId, game);
          return new Response("State updated", { status: 200 });
        },
        { body: setGameStateSchema }
      )
  );
