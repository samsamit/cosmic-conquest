import { Elysia } from "elysia";
import { controllers } from "./controllers";
import { decorators } from "./server.plugins";

export const app = new Elysia().use(decorators).use(controllers).listen(3000);

console.log(
  `🦊 Elysia api endpoint is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
