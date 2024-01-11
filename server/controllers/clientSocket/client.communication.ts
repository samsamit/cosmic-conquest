import { BotActionSchema } from "controllers/botController/bot.communication";
import { t } from "elysia";

const ClientBotActionSchema = t.Object({
  event: t.Literal("manualAction"),
  gameId: t.String(),
  shipId: t.String(),
  action: BotActionSchema,
});

export const ClientEventSchema = ClientBotActionSchema;
