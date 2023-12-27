import { ServerWebSocket } from "bun";
import { TSchema } from "elysia";
import { TypeCheck } from "elysia/dist/type-system";

export type AppSocket = ServerWebSocket<{
  validator?: TypeCheck<TSchema> | undefined;
}>;
