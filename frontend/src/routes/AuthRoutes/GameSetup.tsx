import { useGameState } from "@/contexts/GameStateContext";
import { Component, For, createEffect } from "solid-js";

const GameSetup: Component = () => {
  const gameData = useGameState();
  createEffect(() => {
    console.log(gameData);
  });
  return (
    <div class="container pt-4">
      <h1>Game Setup</h1>
      <div class="flex flex-col gap-1">
        <For each={gameData.bots ?? []}>
          {(bot) => <div>{bot.botToken}</div>}
        </For>
      </div>
    </div>
  );
};

export default GameSetup;
