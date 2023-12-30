import { Elysia } from "elysia";
import { controllers } from "./controllers";
import { getServerDecorators } from "server.init";

export const app = new Elysia()
  .use(getServerDecorators)
  .use(controllers)
  .listen(3000);

console.log(
  `🦊 Elysia api endpoint is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
