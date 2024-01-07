import { ParticipantData } from "@/api/createGame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { INITIAL_TEAM_NAME, defaultTeams } from "@/constants";
import clsx from "clsx";
import { AiTwotoneCloseCircle } from "solid-icons/ai";

import {
  Component,
  For,
  JSX,
  ParentComponent,
  Show,
  createEffect,
  createSignal,
} from "solid-js";

export interface TeamParticipantData extends ParticipantData {
  test?: boolean;
}
export interface Team {
  name: string;
  color: string;
  bots: TeamParticipantData[];
}

const TeamsContainer: Component<{
  teams: Team[];
  onTeamsChange: (teams: Team[]) => void;
}> = (props) => {
  createEffect(() => {
    console.log("teams", props.teams);
  });

  const handleOnDrag = (e: DragEvent, bot: ParticipantData) => {
    console.log("drag start");
    e.dataTransfer?.setData("botId", JSON.stringify(bot));
  };

  const handleDrop = (e: DragEvent, targetTeam: string) => {
    const data = e.dataTransfer?.getData("botId");
    if (!data) return;
    const { botToken, teamName }: ParticipantData = JSON.parse(data);
    if (teamName === targetTeam) return;
    console.log("drop", botToken, teamName, targetTeam);
    const updatedTeams = props.teams.map((t) => {
      if (t.name === teamName) {
        return {
          ...t,
          bots: t.bots.filter((b) => b.botToken !== botToken),
        };
      }
      if (t.name === targetTeam) {
        return {
          ...t,
          bots: [...t.bots, { botToken, teamName: t.name, teamColor: t.color }],
        };
      }
      return t;
    });
    props.onTeamsChange(updatedTeams);
  };

  const removeTeam = (teamName: string) => {
    const teamToRemove = props.teams.find((t) => t.name === teamName);
    if (!teamToRemove) return;
    const botsToMove = teamToRemove.bots;
    const updatedTeams = props.teams.reduce<Team[]>((acc, t) => {
      if (t.name === teamName) return acc;
      if (t.name === INITIAL_TEAM_NAME) {
        return [
          ...acc,
          {
            ...t,
            bots: [
              ...t.bots,
              ...botsToMove.map((b) => ({
                ...b,
                teamName: t.name,
                teamColor: t.color,
              })),
            ],
          },
        ];
      }
      return [...acc, t];
    }, []);
    props.onTeamsChange(updatedTeams);
  };

  const removeTestParticipant = (botToken: string) => {
    const updatedTeams = props.teams.map((t) => ({
      ...t,
      bots: t.bots.filter((b) => b.botToken !== botToken),
    }));
    props.onTeamsChange(updatedTeams);
  };

  return (
    <div class="flex flex-col gap-4">
      <For each={props.teams}>
        {(team) => (
          <TeamComponent
            team={team}
            onDrop={(e) => handleDrop(e, team.name)}
            actionButton={
              team.name !== INITIAL_TEAM_NAME && (
                <Button
                  size={"icon"}
                  onClick={() => removeTeam(team.name)}
                  class="text-sm h-6 w-6"
                  variant={"ghost"}
                >
                  <AiTwotoneCloseCircle />
                </Button>
              )
            }
          >
            <For
              each={team.bots}
              fallback={<p class="text-base">No bots...</p>}
            >
              {(bot) => (
                <BotComponent
                  bot={bot}
                  onDrag={(e) => handleOnDrag(e, bot)}
                  removeTestParticipant={() =>
                    removeTestParticipant(bot.botToken)
                  }
                />
              )}
            </For>
          </TeamComponent>
        )}
      </For>
    </div>
  );
};

const BotComponent: Component<{
  bot: TeamParticipantData;
  removeTestParticipant: () => void;
  onDrag: (e: DragEvent) => void;
}> = (props) => {
  return (
    <Badge draggable onDragStart={props.onDrag} class="h-6 flex gap-2">
      {props.bot.botToken}
      <Show when={props.bot.test}>
        <Button
          class="text-sm h-4 w-4 rounded-full p-0"
          variant={"ghost"}
          onClick={props.removeTestParticipant}
        >
          <AiTwotoneCloseCircle />
        </Button>
      </Show>
    </Badge>
  );
};

const TeamComponent: ParentComponent<{
  team: Team;
  onDrop: (e: DragEvent) => void;
  actionButton: JSX.Element;
}> = (props) => {
  const [hovering, setHovering] = createSignal(false);
  return (
    <div
      class={clsx([
        "border-2 border-border flex flex-col",
        hovering() && "border-dashed bg-secondary-foreground/50",
      ])}
      onDrop={(e) => {
        props.onDrop(e);
        e.preventDefault();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setHovering(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setHovering(false);
      }}
    >
      <div
        class="flex justify-between items-center p-2"
        style={{ "background-color": props.team.color }}
      >
        <div class="bg-primary-foreground/50 rounded-sm px-2">
          <h2>{props.team.name}</h2>
        </div>
        {props.actionButton}
      </div>
      <Separator />
      <div class="flex flex-wrap gap-2 p-2">{props.children}</div>
    </div>
  );
};

export default TeamsContainer;
