import { useGameState } from "@/contexts/GameStateContext";
import { Position } from "@/schemas/gameState.schema";
import {
  Component,
  For,
  ParentComponent,
  Show,
  createEffect,
  createSignal,
} from "solid-js";
import ValueButton from "../buttons/ValueButton";

const GameMap: Component = () => {
  console.log("GameMap render");
  const gameState = useGameState();

  createEffect(() => {
    console.log("gameStateUpdate: ", gameState.data);
  });

  const [cellSize, setCellSize] = createSignal(10);
  const [zoom, setZoom] = createSignal(1);
  return (
    <Show
      when={true || gameState.data}
      fallback={<div>Waiting for game data...</div>}
    >
      <div
        style={{
          display: "grid",
          "grid-template-columns": `repeat(${
            gameState.data?.mapWidth
          }, ${cellSize()}px)`,
          "grid-template-rows": `repeat(${
            gameState.data?.mapHeight
          }, ${cellSize()}px)`,
        }}
      >
        <For
          each={getCells(
            gameState.data?.mapWidth ?? 0,
            gameState.data?.mapHeight ?? 0
          )}
        >
          {(position) => <Cell></Cell>}
        </For>
      </div>
      <ValueButton
        onDecrease={() => setZoom((prev) => prev + 0.1)}
        onIncrease={() => setZoom((prev) => prev - 0.1)}
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
