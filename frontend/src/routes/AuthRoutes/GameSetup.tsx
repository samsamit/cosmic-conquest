import { ParticipantData, createGame } from "@/api/createGame";
import TeamsContainer, {
  Team,
  TeamParticipantData,
} from "@/components/custom/TeamSelection/TeamsContainer";
import { Button } from "@/components/ui/button";
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
        })) ?? [],
    },
  ]);

  createComputed(
    on(
      () => gameData.bots ?? [],
      (bots) => {
        const botsInTeams = teams().reduce(
          (acc, t) => [...acc, ...t.bots.map((b) => b.botToken)],
          [] as string[]
        );
        const botsNotInTeams = bots
          .filter((b) => !botsInTeams.includes(b.botToken))
          .map((b) => b.botToken);
        const missingBots = botsInTeams.filter(
          (b) => !bots.map((b) => b.botToken).includes(b)
        );
        const updatedTeams = teams().map((t) => {
          if (t.name === INITIAL_TEAM_NAME) {
            return {
              ...t,
              bots: [
                ...t.bots.filter((b) => !missingBots.includes(b.botToken)),
                ...botsNotInTeams.map((b) => ({
                  botToken: b,
                  teamColor: t.color,
                  teamName: t.name,
                })),
              ],
            };
          }
          return {
            ...t,
            bots: [...t.bots.filter((b) => !missingBots.includes(b.botToken))],
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
      }));
      return [...acc, ...participants];
    }, [] as ParticipantData[]);
    const gameId = await createGame(participantData);
    if (!gameId) {
      alert("Something went wrong");
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

  const addTeam = () => {
    const defaultTeam = getNewTeam(teams());
    if (!defaultTeam) {
      alert("No more teams available");
      return;
    }
    const newTeam: Team = {
      name: defaultTeam.name,
      color: defaultTeam.color,
      bots: [],
    };
    setTeams((prev) => [...prev, newTeam]);
  };

  const addTestBot = () => {
    const testParticipantData: TeamParticipantData = {
      botToken: crypto.randomUUID(),
      teamColor: "",
      teamName: INITIAL_TEAM_NAME,
      test: true,
    };
    const updatedTeams = teams().map((t) => {
      if (t.name === INITIAL_TEAM_NAME) {
        return {
          ...t,
          bots: [...t.bots, testParticipantData],
        };
      }
      return t;
    });
    setTeams(updatedTeams);
  };

  return (
    <div class="container pt-4 flex flex-col gap-4">
      <h1>Game setup:</h1>
      <div class="flex gap-2">
        <Button size={"sm"} onClick={addTestBot}>
          Add test bot
        </Button>
        <Button size={"sm"} onClick={addTeam}>
          Add team
        </Button>
      </div>

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

const getNewTeam = (teams: Team[]) => {
  const teamsWithoutInitial = teams.filter((t) => t.name !== INITIAL_TEAM_NAME);
  const awailableTeaams = defaultTeams.filter(
    (t) => !teamsWithoutInitial.map((t) => t.color).includes(t.color)
  );
  if (awailableTeaams.length === 0) return;
  return awailableTeaams[0];
};
