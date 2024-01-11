import { z } from "zod";

const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export type Position = z.infer<typeof PositionSchema>;

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
export type Direction = z.infer<typeof DirectionSchema>;

const ShipSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  hitboxRadius: z.number(),
  type: z.literal("ship"),
  team: z.string(),
  teamColor: z.string(),
  health: z.number(),
  maxHealth: z.number(),
  visionRange: z.number(),
  manualControl: z.boolean().optional(),
});
export type Ship = z.infer<typeof ShipSchema>;

const ProjectileSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  direction: DirectionSchema,
  hitboxRadius: z.number(),
  type: z.literal("projectile"),
  mass: z.number(),
  speed: z.number(),
});
export type Projectile = z.infer<typeof ProjectileSchema>;

const ExplosionSchema = z.object({
  id: z.string(),
  position: PositionSchema,
  type: z.literal("explosion"),
});
export type Explosion = z.infer<typeof ExplosionSchema>;

const EntitySchema = z.union([ShipSchema, ProjectileSchema, ExplosionSchema]);
export type Entity = z.infer<typeof EntitySchema>;
export const GameStateSchema = z.union([
  z.literal("READY"),
  z.literal("RUNNING"),
  z.literal("PAUSED"),
  z.literal("STOPPED"),
]);

export type GameState = z.infer<typeof GameStateSchema>;

export const GameUpdateSchema = z.object({
  gameState: GameStateSchema,
  entities: EntitySchema.array(),
  mapHeight: z.number(),
  mapWidth: z.number(),
});

export type GameUpdate = z.infer<typeof GameUpdateSchema>;

export const isShip = (entity: Entity): entity is Ship =>
  entity.type === "ship";
export const isProjectile = (entity: Entity): entity is Projectile =>
  entity.type === "projectile";
export const isExplosion = (entity: Entity): entity is Explosion =>
  entity.type === "explosion";
