import { z } from "zod";
import { PositionSchema, DirectionSchema, PoolSchema } from "../general.schema";

export const ShipDataSchema = z.object({
  type: z.literal("ship"),
  id: z.string(),
  team: z.string(),
  teamColor: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  health: PoolSchema,
  heat: PoolSchema,
  vision: z.number().int().positive(),
  hitboxRadius: z.number().int().positive(),
});
export type ShipData = z.infer<typeof ShipDataSchema>;
