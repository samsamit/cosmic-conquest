import { ParticipantData, createGame } from "@/api/createGame";
import TeamsContainer, {
  Team,
} from "@/components/custom/TeamSelection/TeamsContainer";
import { Button } from "@/components/ui/button";
import { showToast } from "@/components/ui/toast";
import { INITIAL_TEAM_NAME, defaultTeams } from "@/constants";
import { useGameState } from "@/contexts/GameStateContext";
import { useNavigate } from "@solidjs/router";
import {
  Component,
  createComputed,
  createMemo,
  createSignal,
  on,
} from "solid-js";

const GameSetup: Component = () => {
  const [gameData, { setGameId }] = useGameState();
  const navigate = useNavigate();

  const [teams, setTeams] = createSignal<Team[]>([
    {
      name: INITIAL_TEAM_NAME,
      color: "",
      bots:
        gameData.bots?.map<ParticipantData>((b) => ({
          botToken: b.botToken,
          teamColor: "",
          teamName: INITIAL_TEAM_NAME,
          test: false,
          name: b.name,
        })) ?? [],
    },
    { ...defaultTeams[0], bots: [] },
    { ...defaultTeams[1], bots: [] },
  ]);

  createComputed(
    on(
      () => gameData.bots ?? [],
      (bots) => {
        const botsInTeams = teams().reduce(
          (acc, t) => [...acc, ...t.bots],
          [] as ParticipantData[]
        );
        const botsNotInTeams = bots.filter(
          (b) => !botsInTeams.map((b) => b.botToken).includes(b.botToken)
        );
        const missingBots = botsInTeams.filter(
          (b) => !bots.map((b) => b.botToken).includes(b.botToken)
        );
        const updatedTeams = teams().map((t) => {
          if (t.name === INITIAL_TEAM_NAME) {
            return {
              ...t,
              bots: [
                ...t.bots.filter(
                  (b) =>
                    !missingBots.map((b) => b.botToken).includes(b.botToken)
                ),
                ...botsNotInTeams.map<ParticipantData>((b) => ({
                  botToken: b.botToken,
                  teamColor: t.color,
                  teamName: t.name,
                  name: b.name,
                })),
              ],
            };
          }
          return {
            ...t,
            bots: [
              ...t.bots.filter(
                (b) => !missingBots.map((b) => b.botToken).includes(b.botToken)
              ),
            ],
          };
        });
        setTeams(updatedTeams);
      }
    )
  );

  const handleStartGame = async () => {
    const battleTeams = teams().filter((t) => t.name !== INITIAL_TEAM_NAME);
    const participantData = battleTeams.reduce((acc, t) => {
      const participants: ParticipantData[] = t.bots.map((b) => ({
        botToken: b.botToken,
        teamColor: t.color,
        teamName: t.name,
        name: b.name,
        manualControl: b.manualControl,
      }));
      return [...acc, ...participants];
    }, [] as ParticipantData[]);
    const gameId = await createGame(participantData);
    if (!gameId) {
      showToast({
        title: "Could not create game",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
      return;
    }
    setGameId(gameId);
    navigate("/game/" + gameId);
  };

  const readyToStart = createMemo(() => {
    const battleTeams = teams().filter((t) => t.name !== INITIAL_TEAM_NAME);
    console.log(battleTeams);
    return (
      battleTeams.length > 0 && battleTeams.every((t) => t.bots.length > 0)
    );
  });

  return (
    <div class="container pt-4 flex flex-col gap-4">
      <h1>Game setup:</h1>

      <TeamsContainer teams={teams()} onTeamsChange={setTeams} />
      <Button
        disabled={!readyToStart()}
        onClick={async () => await handleStartGame()}
      >
        {readyToStart() ? "Ready for battle!" : "Add bots to teams"}
      </Button>
    </div>
  );
};

export default GameSetup;
