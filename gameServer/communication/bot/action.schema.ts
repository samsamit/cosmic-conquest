import { z } from "zod";

export const BotMoveActionSchema = z.object({
  event: z.literal("move"),
  data: z.object({
    steps: z.number().int().positive(),
  }),
});
export type BotMoveAction = z.infer<typeof BotMoveActionSchema>;
