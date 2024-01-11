import { showToast } from "@/components/ui/toast";
import { GameStateSchema } from "@/schemas/gameState.schema";
import { useNavigate } from "@solidjs/router";

export const fetchGameUpdate = async (gameId: string) => {
  const navigate = useNavigate();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${gameId}/update`
  );
  if (!response.ok) {
    const error = await response.text();
    showToast({
      title: "Something went wrong",
      description: error,
      variant: "destructive",
    });
    navigate("/");
    return null;
  }
  const gameUpdate = await GameStateSchema.safeParseAsync(
    await response.json()
  );
  if (!gameUpdate.success) {
    showToast({
      title: "Something went wrong",
      description: gameUpdate.error.message,
      variant: "destructive",
    });
    return null;
  }
  return gameUpdate.data;
};
