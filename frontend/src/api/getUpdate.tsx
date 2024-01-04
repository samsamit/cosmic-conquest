import { GameStateSchema } from "@/schemas/gameState.schema";

export const fetchGameUpdate = async (gameId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${gameId}/update`
  );
  if (!response.ok) {
    const error = await response.text();
    alert(error);
    return null;
  }
  const gameUpdate = await GameStateSchema.safeParseAsync(
    await response.json()
  );
  if (!gameUpdate.success) {
    alert(gameUpdate.error);
    return null;
  }
  return gameUpdate.data;
};
