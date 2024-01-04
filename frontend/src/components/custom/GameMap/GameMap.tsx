import { GameStateStore } from "@/contexts/GameStateContext";
import { Entity, Position } from "@/schemas/gameState.schema";
import {
  Component,
  For,
  ParentComponent,
  Show,
  createEffect,
  createSignal,
  on,
} from "solid-js";
import ValueButton from "../buttons/ValueButton";
import {
  centerContainer,
  handleDragScrolling,
} from "@/utils/handleDragScrolling";
import EntityCell from "./Entity";

const GameMap: Component<{ gameData: NonNullable<GameStateStore["data"]> }> = (
  props
) => {
  const [mapContainer, setMapContainer] = createSignal<HTMLDivElement>();
  createEffect(() => {
    if (!mapContainer()) return;
    handleDragScrolling(mapContainer());
    centerContainer(mapContainer());
  });
  const [cellSize, setCellSize] = createSignal(40);

  const handleZoom = (change: number) => {
    setCellSize((prev) => prev + change);
    centerContainer(mapContainer());
  };

  createEffect(() => console.log("gameData change", props.gameData));

  return (
    <>
      <MapContainer onRef={(ref) => setMapContainer(ref)}>
        <div
          class="m-auto"
          style={{
            display: "grid",
            "grid-template-columns": `repeat(${
              props.gameData.mapWidth
            }, ${cellSize()}px)`,
            "grid-template-rows": `repeat(${
              props.gameData.mapHeight
            }, ${cellSize()}px)`,
          }}
        >
          <For
            each={getCells(
              props.gameData.mapWidth ?? 0,
              props.gameData.mapHeight ?? 0
            )}
          >
            {(position) => (
              <Cell>
                <For each={props.gameData.entities}>
                  {(entity) => (
                    <Show
                      when={
                        entity.position.x === position.x &&
                        entity.position.y == position.y
                          ? entity
                          : false
                      }
                    >
                      {(entity) => <EntityCell entity={entity()} />}
                    </Show>
                  )}
                </For>
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
    </>
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

const getEntityInPosition = (position: Position, entities: Entity[]) => {
  return (
    entities.find(
      (entity) =>
        entity.position.x === position.x && entity.position.y === position.y
    ) ?? null
  );
};
