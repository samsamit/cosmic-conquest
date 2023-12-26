import { z } from "zod";
import { BotMoveActionSchema } from "./action.schema";

const BotActionSchema = BotMoveActionSchema;
const BotActionEventSchema = z.object({
  event: z.literal("action"),
  action: BotActionSchema,
});
export type BotAction = z.infer<typeof BotActionSchema>;

export const BotMessageSchema = BotActionEventSchema;
export type BotMessage = z.infer<typeof BotMessageSchema>;
export interface BotError {
  error: string;
  message?: string;
}
