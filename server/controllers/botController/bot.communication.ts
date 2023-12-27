import { t } from "elysia";

// From bot to server
const BotMoveActionSchema = t.Object({
  action: t.Literal("move"),
  distance: t.Number(),
});

const BotTurnActionSchema = t.Object({
  action: t.Literal("turn"),
  direction: t.Union([t.Literal("left"), t.Literal("right")]),
});

export const BotActionSchema = t.Union([
  BotMoveActionSchema,
  BotTurnActionSchema,
]);

// Server to bot
