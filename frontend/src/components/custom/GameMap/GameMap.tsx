import { GameStateStore } from "@/contexts/GameStateContext";
import {
  Component,
  For,
  Index,
  ParentComponent,
  createEffect,
  createSignal,
} from "solid-js";
import ValueButton from "../buttons/ValueButton";
import {
  centerContainer,
  handleDragScrolling,
} from "@/utils/handleDragScrolling";
import EntityCell from "./Entity";

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
        <table class="border-collapse w-fit h-fit relative m-auto">
          <For each={Array.from({ length: props.gameData.mapHeight })}>
            {(_) => (
              <tr>
                <For each={Array.from({ length: props.gameData.mapWidth })}>
                  {(_) => (
                    <td
                      style={{
                        height: cellSize() + "px",
                        width: cellSize() + "px",
                      }}
                      class="border border-border"
                    ></td>
                  )}
                </For>
              </tr>
            )}
          </For>
          <Index each={props.gameData.entities}>
            {(entity) => <EntityCell entity={entity()} cellSize={cellSize()} />}
          </Index>
        </table>
      </MapContainer>
      <ValueButton
        onDecrease={() => handleZoom(-5)}
        onIncrease={() => handleZoom(5)}
        class="absolute top-4 right-4"
      />
    </>
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

export default GameMap;
