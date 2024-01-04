import { GameStateStore } from "@/contexts/GameStateContext";
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
import {
  centerContainer,
  handleDragScrolling,
} from "@/utils/handleDragScrolling";

const GameMap: Component<{ gameState: GameStateStore }> = (props) => {
  const [mapContainer, setMapContainer] = createSignal<HTMLDivElement>();
  createEffect(() => {
    if (!mapContainer()) return;
    handleDragScrolling(mapContainer());
    centerContainer(mapContainer());
  });
  const [cellSize, setCellSize] = createSignal(10);

  const handleZoom = (change: number) => {
    setCellSize((prev) => prev + change);
    centerContainer(mapContainer());
  };
  return (
    <Show
      when={props.gameState.data}
      fallback={<div>Waiting for game data...</div>}
    >
      <MapContainer onRef={(ref) => setMapContainer(ref)}>
        <div
          class="m-auto"
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
            {(position) => (
              <Cell>
                <small>
                  {position.x} / {position.y}
                </small>
              </Cell>
            )}
          </For>
        </div>
      </MapContainer>
      <ValueButton
        onDecrease={() => handleZoom(-5)}
        onIncrease={() => handleZoom(5)}
        class="absolute bottom-4 right-4"
      />
    </Show>
  );
};

const Cell: ParentComponent = (props) => {
  return <div class="border border-white w-full h-full">{props.children}</div>;
};

const MapContainer: ParentComponent<{
  onRef: (ref: HTMLDivElement | undefined) => void;
}> = (props) => {
  return (
    <div ref={props.onRef} class="w-full h-full overflow-auto flex  p-4">
      {props.children}
    </div>
  );
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
