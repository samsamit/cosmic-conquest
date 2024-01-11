import { showToast } from "@/components/ui/toast";

export const setGameState = async (
  gameId: string,
  action: "START" | "PAUSE" | "STOP"
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${gameId}/state`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: action }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    showToast({
      title: "Something went wrong",
      description: error,
      variant: "destructive",
    });
  }
};
