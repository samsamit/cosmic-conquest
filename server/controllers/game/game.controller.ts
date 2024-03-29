import { Elysia } from "elysia"
import { setGameStateSchema, startGameSchema } from "./game.schema"
import { getServerDecorators } from "server.init"

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
          })
          console.log("Game created with id: ", gameId)
          botHandler.setGameId(gameId, body.connectionToken, body.participants)
          return new Response("Game created", { status: 200 })
        },
        {
          body: startGameSchema,
        }
      )
      .post(
        "/state",
        ({ gameManager, body, params: { gameId } }) => {
          let game = gameManager.get(gameId)
          switch (body.state) {
            case "START":
              game = game.setState("RUNNING")
              break
            case "PAUSE":
              game = game.setState("PAUSED")
              break
            case "STOP":
              game = game.setState("STOPPED")
              break
            default:
              return new Response("Invalid state", { status: 400 })
          }
          gameManager.set(gameId, game)
          console.log("Game state update request received")
          return new Response("State updated", { status: 200 })
        },
        { body: setGameStateSchema }
      )
      .get("/update", ({ gameManager, params: { gameId } }) => {
        const gameUpdate = gameManager.getGameUpdate(gameId)
        if (!gameUpdate) {
          return new Response("Game not found", { status: 404 })
        }
        console.log("Game update request received")
        return new Response(JSON.stringify(gameUpdate), { status: 200 })
      })
  )
