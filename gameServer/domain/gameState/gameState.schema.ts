import { z } from "zod";
import { ProjectileDataSchema } from "../projectile/projectile.schema";
import { ShipDataSchema } from "../ship/ship.schema";

const GameSettingsSchema = z.object({
  mapWidth: z.number().int().positive(),
  mapHeight: z.number().int().positive(),
});

export const GameStateDataSchema = z.object({
  entities: z.array(z.union([ShipDataSchema, ProjectileDataSchema])),
  mapSettings: GameSettingsSchema,
});
export type GameStateData = z.infer<typeof GameStateDataSchema>;
