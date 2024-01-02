import { z } from "zod";

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const DirectionSchema = z.union([
  z.literal("North"),
  z.literal("NorthEast"),
  z.literal("East"),
  z.literal("SouthEast"),
  z.literal("South"),
  z.literal("SouthWest"),
  z.literal("West"),
  z.literal("NorthWest"),
]);

const ShipSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  hitboxRadius: z.number(),
  type: z.literal("ship"),
  team: z.string(),
  health: z.number(),
  maxHealth: z.number(),
  visionRange: z.number(),
});

const ProjectileSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  hitboxRadius: z.number(),
  type: z.literal("projectile"),
  mass: z.number(),
  speed: z.number(),
});

const ExplosionSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  type: z.literal("explosion"),
});

const EntitySchema = z.union([ShipSchema, ProjectileSchema, ExplosionSchema]);

export const GameStateSchema = z.object({
  entities: EntitySchema.array(),
  mapHeight: z.number(),
  mapWidth: z.number(),
});

export type GameState = z.infer<typeof GameStateSchema>;
