import { fetchGameUpdate } from "@/api/getUpdate";
import { setGameState } from "@/api/setGameState";
import GameMap from "@/components/custom/GameMap/GameMap";
import TeamsRow from "@/components/custom/GameMap/TeamsRow";
import ControlRow from "@/components/custom/GameMap/manualControl/ControlRow";
import Text from "@/components/custom/typography/Text";
import { Button } from "@/components/ui/button";
import { useGameState } from "@/contexts/GameStateContext";
import { Ship } from "@/schemas/gameState.schema";
import { useParams } from "@solidjs/router";
import {
  Component,
  Match,
  Show,
  Switch,
  createMemo,
  createResource,
} from "solid-js";

const Game: Component<{}> = () => {
  const { gameId } = useParams();
  const [gameState] = useGameState();
  const [initialGameUpdate] = createResource(
    () => gameState,
    () => fetchGameUpdate(gameId)
  );

  const gameData = createMemo(() =>
    gameState.gameData ? gameState.gameData : initialGameUpdate()
  );

  const testShips = createMemo(
    () =>
      gameData()?.entities.filter(
        (e): e is Ship => e.type === "ship" && Boolean(e.manualControl)
      ) ?? []
  );
  return (
    <div class="h-full w-full flex flex-col">
      <div class="h-full w-full relative">
        <Show when={gameData()} fallback={<div>Waiting for game data...</div>}>
          {(state) => (
            <>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
                <Switch>
                  <Match when={state().gameState === "READY"}>
                    <Button
                      onClick={async () => await setGameState(gameId, "START")}
                    >
                      Start game
                    </Button>
                  </Match>
                  <Match when={state().gameState === "STOPPED"}>
                    <Text class="text-background" size="3xl">
                      Game ended
                    </Text>
                  </Match>

                  <Match when={state().gameState === "PAUSED"}>
                    <Text class="text-background" size="3xl">
                      Game paused
                    </Text>
                  </Match>
                </Switch>
              </div>
              <GameMap gameData={state()} />
            </>
          )}
        </Show>
      </div>
      <TeamsRow
        connectedBots={gameState.bots?.map((b) => b.botToken) ?? []}
        ships={
          gameData()?.entities.filter((e): e is Ship => e.type === "ship") ?? []
        }
      />
      <ControlRow testShips={testShips()} gameId={gameId} />
    </div>
  );
};

export default Game;
