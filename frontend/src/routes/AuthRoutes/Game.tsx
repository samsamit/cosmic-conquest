import { fetchGameUpdate } from "@/api/getUpdate";
import GameMap from "@/components/custom/GameMap/GameMap";
import { GameStateStore, useGameState } from "@/contexts/GameStateContext";
import { useParams } from "@solidjs/router";
import { Component, createMemo, createResource } from "solid-js";

const Game: Component<{}> = () => {
  const { gameId } = useParams();
  const gameState = useGameState();
  const [initialGameUpdate] = createResource(
    () => gameState,
    () => fetchGameUpdate(gameId)
  );

  const thisGameState = createMemo<GameStateStore>(() => {
    return {
      data: initialGameUpdate() ?? gameState.data,
      connection: gameState.connection,
    };
  });

  return (
    <div class="h-screen w-full">
      <GameMap gameState={thisGameState()} />
    </div>
  );
};

export default Game;
