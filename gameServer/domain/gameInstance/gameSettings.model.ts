export interface GameSettings {
  mapWidth: number;
  mapHeight: number;
  maxRounds: number;
  maxEnergy: number;
  tickLength: number;
  vision: number;
  maxHealth: number;
}

export const createGameSettings = (
  data: Partial<GameSettings>
): GameSettings => ({
  mapWidth: data.mapWidth || 100,
  mapHeight: data.mapHeight || 100,
  maxRounds: data.maxRounds || 0,
  maxEnergy: data.maxEnergy || 100,
  tickLength: data.tickLength || 500,
  vision: data.vision || 10,
  maxHealth: data.maxHealth || 100,
});
