import { fetchGameUpdate } from "@/api/getUpdate";
import GameMap from "@/components/custom/GameMap/GameMap";
import { GameStateStore, useGameState } from "@/contexts/GameStateContext";
import { useParams } from "@solidjs/router";
import {
  Component,
  Show,
  createEffect,
  createMemo,
  createResource,
  on,
} from "solid-js";

const Game: Component<{}> = () => {
  const { gameId } = useParams();
  const gameState = useGameState();
  const [initialGameUpdate] = createResource(
    () => gameState,
    () => fetchGameUpdate(gameId)
  );

  return (
    <div class="h-screen w-full">
      <Show
        when={gameState.data ? gameState.data : initialGameUpdate()}
        fallback={<div>Waiting for game data...</div>}
      >
        {(state) => <GameMap gameData={state()} />}
      </Show>
    </div>
  );
};

export default Game;
