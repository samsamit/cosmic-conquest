export interface GameSettings {
  mapWidth: number;
  mapHeight: number;
  maxRounds: number;
  maxHeat: number;
  tickLength: number;
  vision: number;
  maxHealth: number;
  shipRadius: number;
  collisionDamage: number;
}

export const createGameSettings = (
  data: Partial<GameSettings>
): GameSettings => ({
  mapWidth: data.mapWidth || 100,
  mapHeight: data.mapHeight || 100,
  maxRounds: data.maxRounds || 0,
  maxHeat: data.maxHeat || 100,
  tickLength: data.tickLength || 500,
  vision: data.vision || 10,
  maxHealth: data.maxHealth || 100,
  shipRadius: data.shipRadius || 1,
  collisionDamage: data.collisionDamage || 10,
});
