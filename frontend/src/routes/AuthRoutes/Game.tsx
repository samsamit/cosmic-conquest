import { useGameState } from "@/contexts/GameStateContext";
import { Component } from "solid-js";

const Game: Component<{}> = () => {
  const gameState = useGameState();
  return (
    <div>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
};

export default Game;
