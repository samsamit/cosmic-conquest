import Elysia, { t } from "elysia"
import { getServerDecorators } from "server.init"
import { ClientEventSchema } from "./client.communication"

export const clientController = new Elysia()
  .use(getServerDecorators)
  .guard({
    query: t.Object({
      connectionToken: t.String(),
    }),
  })
  .ws("/client", {
    body: ClientEventSchema,
    open: (socket) => {
      const connectionToken = socket.data.query["connectionToken"]
      socket.data.clientHandler.addClient(connectionToken, socket.raw)
      const allBots = socket.data.botHandler.getUserBotData(connectionToken)
      socket.data.clientHandler.sendBots(connectionToken, allBots)
      socket.data.clientHandler.sendConnectionInfo(connectionToken)
      console.log("client connected with token: ", connectionToken)
    },
    close: (socket) => {
      const connectionToken = socket.data.query["connectionToken"]
      socket.data.clientHandler.removeClient(connectionToken)
      console.log("client disconnected")
    },
    message: (socket, payload) => {
      switch (payload.event) {
        case "manualAction":
          try {
            const { gameId, shipId, action: actionPayload } = payload
            switch (actionPayload.action) {
              case "move":
                socket.data.gameManager.addAction(gameId, {
                  botToken: shipId,
                  action: "move",
                  distance: actionPayload.distance,
                })
                break
              case "turn":
                socket.data.gameManager.addAction(gameId, {
                  botToken: shipId,
                  action: "turn",
                  direction: actionPayload.direction,
                })
                break
            }
          } catch (e) {
            if (e instanceof Error) {
              console.log(e.message)
              socket.send({ event: "error", message: e.message })
            } else {
              console.log(e)
              socket.send({ event: "error", message: "unknown error" })
            }
          }
          break
      }
    },
  })
