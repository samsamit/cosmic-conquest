import { Component, For, Show, createMemo } from "solid-js";
import { Ship } from "@/schemas/gameState.schema";
import { Badge } from "@/components/ui/badge";
import { TbPlugConnectedX } from "solid-icons/tb";

const TeamsRow: Component<{ ships: Ship[]; connectedBots: string[] }> = (
  props
) => {
  const teams = createMemo(() =>
    props.ships.reduce((acc, ship) => {
      const team = acc.find((team) => team.name === ship.team);
      if (team) {
        team.ships.push(ship);
      } else {
        acc.push({ name: ship.team, ships: [ship] });
      }
      return acc;
    }, [] as Array<{ name: string; ships: Ship[] }>)
  );

  return (
    <div class="w-full flex gap-4 justify-center p-4">
      <For each={teams()}>
        {(team) => (
          <div class="flex flex-col border border-border bg-card">
            <div
              class="px-2"
              style={{
                "background-color": team.ships[0].teamColor,
              }}
            >
              <span class="bg-primary-foreground/50 rounded-sm px-2">
                Team: {team.name}
              </span>
            </div>

            <div class="p-2 flex gap-2 flex-wrap">
              <For each={team.ships}>
                {(ship) => {
                  const isConnected =
                    props.connectedBots.includes(ship.id) || ship.manualControl;
                  return (
                    <Badge class={"whitespace-nowrap flex gap-1"}>
                      {ship.name}
                      <Show when={!isConnected}>
                        <TbPlugConnectedX />
                      </Show>
                    </Badge>
                  );
                }}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};

export default TeamsRow;
