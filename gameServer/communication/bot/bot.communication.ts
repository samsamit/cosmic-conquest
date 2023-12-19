import { z } from "zod";

const BotActionSchema = z.object({
  event: z.literal("action"),
  data: z.null(),
});
export type BotAction = z.infer<typeof BotActionSchema>;

export const BotMessageSchema = BotActionSchema;
export type BotMessage = z.infer<typeof BotMessageSchema>;
export interface BotError {
  error: string;
  message?: string;
}
