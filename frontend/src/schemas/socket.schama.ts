import { z } from "zod";
import { GameStateSchema } from "./gameState.schema";

const BotsDataSchema = z.object({
  botToken: z.string(),
  gameId: z.string().nullable(),
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

export const SocketEventSchema = z.union([BotsEventSchema, UpdateEventSchema]);
