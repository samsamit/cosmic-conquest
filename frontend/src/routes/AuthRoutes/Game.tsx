import { fetchGameUpdate } from "@/api/getUpdate";
import GameMap from "@/components/custom/GameMap/GameMap";
import TeamsRow from "@/components/custom/GameMap/TeamsRow";
import ControlRow from "@/components/custom/GameMap/manualControl/ControlRow";
import { useGameState } from "@/contexts/GameStateContext";
import { Ship } from "@/schemas/gameState.schema";
import { useParams } from "@solidjs/router";
import { Component, Show, createMemo, createResource } from "solid-js";

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
          {(state) => <GameMap gameData={state()} />}
        </Show>
      </div>
      <TeamsRow
        ships={
          gameData()?.entities.filter((e): e is Ship => e.type === "ship") ?? []
        }
      />
      <ControlRow testShips={testShips()} gameId={gameId} />
    </div>
  );
};

export default Game;
