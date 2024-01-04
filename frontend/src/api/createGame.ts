export interface ParticipantData {
  botToken: string;
  teamName: string;
  teamColor: string;
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
    alert(error);
    return null;
  }
  return gameId;
};
