import { showToast } from "@/components/ui/toast";

export interface ParticipantData {
  botToken: string;
  name: string;
  teamName: string;
  teamColor: string;
  manualControl?: boolean;
}

export const createGame = async (participants: ParticipantData[]) => {
  const gameId = crypto.randomUUID();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/${gameId}/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participants }),
    }
  );
  if (!response.ok) {
    const error = await response.text();
    showToast({
      title: "Something went wrong",
      description: error,
      variant: "destructive",
    });
    return null;
  }
  return gameId;
};
