import { t } from "elysia";

export const startGameSchema = t.Object({
  participants: t.Array(
    t.Object({
      botToken: t.String(),
      teamName: t.String(),
      teamColor: t.String(),
    })
  ),
});

export const setGameStateSchema = t.Object({
  state: t.Union([t.Literal("START"), t.Literal("PAUSE"), t.Literal("STOP")]),
});
