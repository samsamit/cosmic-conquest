import { z } from "zod";

export const PositionSchema = z.object({
  x: z.number().int().positive(),
  y: z.number().int().positive(),
});
export type Position = z.infer<typeof PositionSchema>;
export const PoolSchema = z.object({
  current: z.number().int().positive(),
  max: z.number().int().positive(),
});
export type Pool = z.infer<typeof PoolSchema>;
export const DirectionSchema = z.enum([
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
]);
export type Direction = z.infer<typeof DirectionSchema>;
