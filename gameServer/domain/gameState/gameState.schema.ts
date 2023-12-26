import { z } from "zod";
import { ProjectileDataSchema } from "../projectile/projectile.schema";
import { ShipDataSchema } from "../ship/ship.schema";

const GameSettingsSchema = z.object({
  mapWidth: z.number().int().positive(),
  mapHeight: z.number().int().positive(),
});
const EntitySchema = z.union([ShipDataSchema, ProjectileDataSchema]);
export type Entity = z.infer<typeof EntitySchema>;
export const GameStateDataSchema = z.object({
  entities: z.array(EntitySchema),
  mapSettings: GameSettingsSchema,
});
export type GameStateData = z.infer<typeof GameStateDataSchema>;
