import { GameStateStore } from "@/contexts/GameStateContext";
import { Position } from "@/schemas/gameState.schema";
import { Component, For, ParentComponent, Show, createSignal } from "solid-js";
import ValueButton from "../buttons/ValueButton";

const GameMap: Component<{ gameState: GameStateStore }> = (props) => {
  const [cellSize, setCellSize] = createSignal(10);
  return (
    <Show
      when={props.gameState.data}
      fallback={<div>Waiting for game data...</div>}
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(${
            props.gameState.data?.mapWidth
          }, ${cellSize()}px)`,
          "grid-template-rows": `repeat(${
            props.gameState.data?.mapHeight
          }, ${cellSize()}px)`,
        }}
      >
        <For
          each={getCells(
            props.gameState.data?.mapWidth ?? 0,
            props.gameState.data?.mapHeight ?? 0
          )}
        >
          {(position) => <Cell></Cell>}
        </For>
      </div>
      <ValueButton
        onDecrease={() => setCellSize((prev) => prev - 5)}
        onIncrease={() => setCellSize((prev) => prev + 5)}
        class="absolute bottom-4 right-4"
      />
    </Show>
  );
};

const Cell: ParentComponent = (props) => {
  return <div class="border border-white w-full h-full">{props.children}</div>;
};

export default GameMap;

const getCells = (mapWidth: number, mapHeight: number): Position[] => {
  const cells: Position[] = [];
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const cell = { x, y };
      cells.push(cell);
    }
  }
  return cells;
};
