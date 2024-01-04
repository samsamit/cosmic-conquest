import GameMap from "@/components/custom/GameMap/GameMap";
import { useGameState } from "@/contexts/GameStateContext";
import { Component } from "solid-js";

const Game: Component<{}> = () => {
  const gameState = useGameState();

  return (
    <div>
      <GameMap />
    </div>
  );
};

export default Game;
