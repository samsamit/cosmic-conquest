import { z } from "zod";
import { PositionSchema, DirectionSchema } from "../general.schema";

export const ProjectileDataSchema = z.object({
  type: z.union([z.literal("projectile"), z.literal("asteroid")]),
  id: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  speed: z.number().int().positive(),
  mass: z.number().int().positive(),
});
export type ProjectileData = z.infer<typeof ProjectileDataSchema>;
