import Elysia, { t } from "elysia";
import { getServerDecorators } from "server.init";

export const clientController = new Elysia()
  .use(getServerDecorators)
  .guard({
    headers: t.Object({
      "connection-token": t.String(),
    }),
  })
  .ws("/client", {
    open: (socket) => {
      const connectionToken = socket.data.headers["connection-token"];

      console.log("headers", socket.data.headers);
      socket.data.clientHandler.addClient(
        connectionToken as string,
        socket.raw
      );
      console.log("client connected");
      socket.send("connection_ok");
    },
    close: (socket) => {
      const connectionToken = socket.data.headers["connection-token"];
      socket.data.clientHandler.removeClient(connectionToken as string);
      console.log("client disconnected");
    },
    message: (socket, message) => {
      const connectionToken = socket.data.headers["connection-token"];
      console.log("client sent message", message);
    },
  });