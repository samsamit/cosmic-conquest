import { z } from "zod";
import { GameStateSchema } from "./gameState.schema";

const BotsDataSchema = z.object({
  botToken: z.string(),
  gameId: z.string().nullable(),
  color: z.string().nullable(),
  connectionToken: z.string(),
  name: z.string(),
});

export type BotData = z.infer<typeof BotsDataSchema>;

const BotsEventSchema = z.object({
  event: z.literal("bots"),
  data: z.object({ bots: BotsDataSchema.array() }),
});

const UpdateEventSchema = z.object({
  event: z.literal("update"),
  data: GameStateSchema,
});

const ConnectionEventSchema = z.object({
  event: z.literal("connectionInfo"),
  data: z.object({
    connectionToken: z.string(),
    teamName: z.string(),
  }),
});

const ErrorEventSchema = z.object({
  event: z.literal("error"),
  message: z.string(),
});

export const SocketEventSchema = z.union([
  BotsEventSchema,
  UpdateEventSchema,
  ConnectionEventSchema,
  ErrorEventSchema,
]);

export type SocketEvent = z.infer<typeof SocketEventSchema>;
