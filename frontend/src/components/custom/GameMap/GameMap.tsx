import { GameStateStore } from "@/contexts/GameStateContext";
import { Position } from "@/schemas/gameState.schema";
import {
  Component,
  For,
  Index,
  ParentComponent,
  createEffect,
  createSignal,
  onMount,
} from "solid-js";
import ValueButton from "../buttons/ValueButton";
import {
  centerContainer,
  handleDragScrolling,
} from "@/utils/handleDragScrolling";
import EntityCell from "./Entity";
import { createResizeObserver } from "@solid-primitives/resize-observer";

const GameMap: Component<{
  gameData: NonNullable<GameStateStore["gameData"]>;
}> = (props) => {
  const [mapContainerRef, setMapContainerRef] = createSignal<HTMLDivElement>();
  createEffect(() => {
    if (!mapContainerRef()) return;
    handleDragScrolling(mapContainerRef());
    centerContainer(mapContainerRef());
  });
  const [cellSize, setCellSize] = createSignal(40);

  const handleZoom = (change: number) => {
    setCellSize((prev) => prev + change);
    centerContainer(mapContainerRef());
  };

  return (
    <>
      <MapContainer onRef={setMapContainerRef}>
        <MapGrid
          cellSize={cellSize()}
          mapHeight={props.gameData.mapHeight}
          mapWidth={props.gameData.mapWidth}
        >
          <For
            each={getCells(
              props.gameData.mapWidth ?? 0,
              props.gameData.mapHeight ?? 0
            )}
          >
            {(position) => <Cell></Cell>}
          </For>
          <Index each={props.gameData.entities}>
            {(entity) => <EntityCell entity={entity()} cellSize={cellSize()} />}
          </Index>
        </MapGrid>
      </MapContainer>
      <ValueButton
        onDecrease={() => handleZoom(-5)}
        onIncrease={() => handleZoom(5)}
        class="absolute bottom-4 right-4"
      />
    </>
  );
};

const Cell: ParentComponent = (props) => {
  return (
    <div class="border border-white w-full h-full flex justify-center items-center">
      {props.children}
    </div>
  );
};

const MapContainer: ParentComponent<{
  onRef: (ref: HTMLDivElement) => void;
}> = (props) => {
  return (
    <div
      ref={props.onRef}
      class="absolute top-0 left-0 right-0 bottom-0 overflow-auto flex  p-4"
    >
      {props.children}
    </div>
  );
};

const MapGrid: ParentComponent<{
  mapHeight: number;
  mapWidth: number;
  cellSize: number;
}> = (props) => {
  return (
    <div
      class="m-auto relative"
      style={{
        display: "grid",
        "grid-template-columns": `repeat(${props.mapWidth}, ${props.cellSize}px)`,
        "grid-template-rows": `repeat(${props.mapHeight}, ${props.cellSize}px)`,
      }}
    >
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
