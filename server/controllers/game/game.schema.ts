import { Static, t } from "elysia";
const ParticipantSchema = t.Object({
  botToken: t.String(),
  name: t.String(),
  teamName: t.String(),
  teamColor: t.String(),
});
export type ParticipantData = Static<typeof ParticipantSchema>;

export const startGameSchema = t.Object({
  participants: t.Array(ParticipantSchema),
});

export const setGameStateSchema = t.Object({
  state: t.Union([t.Literal("START"), t.Literal("PAUSE"), t.Literal("STOP")]),
});
