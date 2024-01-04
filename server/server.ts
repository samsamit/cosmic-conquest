import { Elysia } from "elysia";
import { controllers } from "./controllers";
import { getServerDecorators } from "server.init";
import cors from "@elysiajs/cors";

export const app = new Elysia()
  .use(cors())
  .use(getServerDecorators)
  .use(controllers)
  .listen(3000);

console.log(
  `🦊 Elysia api endpoint is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
