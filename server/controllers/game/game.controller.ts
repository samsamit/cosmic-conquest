import { Elysia } from "elysia";
import { setGameStateSchema, startGameSchema } from "./game.schema";
import { GameState } from "@domain/models/game/game.model";
import { getServerDecorators } from "server.init";

export const gameController = new Elysia()
  .use(getServerDecorators)
  .group("/game/:gameId", (app) =>
    app
      .post(
        "/create",
        ({ gameManager, botHandler, body, params: { gameId } }) => {
          gameManager.createGame({
            id: gameId,
            participants: body.participants,
          });
          console.log("Game created with id: ", gameId);
          botHandler.setGameId(
            gameId,
            body.participants.map((p) => p.botToken)
          );
          return new Response("Game created", { status: 200 });
        },
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
          console.log("Game state update request received");
          return new Response("State updated", { status: 200 });
        },
        { body: setGameStateSchema }
      )
  );
