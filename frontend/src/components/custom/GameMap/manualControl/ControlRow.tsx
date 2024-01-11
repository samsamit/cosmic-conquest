import { Component, For } from "solid-js";
import ControlContainer from "./ControlContainer";
import { Ship } from "@/schemas/gameState.schema";
import { useSocketData } from "@/contexts/SocketContext";
import { ManualAction } from "@/schemas/action.schema";

const ControlRow: Component<{ testShips: Ship[]; gameId: string }> = (
  props
) => {
  const [, { sendManualAction }] = useSocketData();

  const onAction = (action: ManualAction, shipId: string) => {
    sendManualAction({
      gameId: props.gameId,
      shipId,
      action,
      event: "manualAction",
    });
  };

  return (
    <div class="w-full p-4 flex gap-4 justify-center">
      <For each={props.testShips}>
        {(ship) => (
          <ControlContainer
            ship={ship}
            onAction={(action) => onAction(action, ship.id)}
          />
        )}
      </For>
    </div>
  );
};

export default ControlRow;
