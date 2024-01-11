import { Button } from "@/components/ui/button";
import { ManualAction, TurnAction } from "@/schemas/action.schema";
import { Ship } from "@/schemas/gameState.schema";
import clsx from "clsx";
import { Component, For, createSignal } from "solid-js";

const ControlContainer: Component<{
  ship: Ship;
  onAction: (action: ManualAction) => void;
}> = (props) => {
  const [steps, setSteps] = createSignal<number | null>(null);
  const [turn, setTurn] = createSignal<TurnAction["direction"] | null>(null);

  const handleAction = () => {
    const distance = steps();
    const direction = turn();
    if (distance !== null) {
      props.onAction({
        action: "move",
        distance: distance,
      });
    }
    if (direction !== null) {
      props.onAction({
        action: "turn",
        direction: direction,
      });
    }

    setSteps(null);
    setTurn(null);
  };

  return (
    <div class="border border-border p-2 flex flex-col w-min gap-1">
      <span>{props.ship.name}</span>
      <div class="flex gap-2">
        <MoveButtons
          maxSteps={3}
          onChange={(steps) => {
            setSteps((prev) => (steps === prev ? null : steps));
            setTurn(null);
          }}
          val={steps()}
        />
        <TurnButtons
          onChange={(turn) => {
            setTurn((prev) => (turn === prev ? null : turn));
            setSteps(null);
          }}
          val={turn()}
        />
      </div>
      <Button
        disabled={turn() === null && steps() === null}
        onClick={handleAction}
        size={"xs"}
      >
        Run action
      </Button>
    </div>
  );
};

export default ControlContainer;

const MoveButtons: Component<{
  maxSteps: number;
  val: number | null;
  onChange: (val: number) => void;
}> = (props) => {
  return (
    <div class="flex flex-col">
      <span class="text-xs">Move:</span>
      <div class="flex ">
        <For each={Array.from({ length: props.maxSteps })}>
          {(_, i) => (
            <Button
              onClick={() => props.onChange(i())}
              class={clsx([
                "border",
                i() === 0 && "rounded-r-none",
                i() === props.maxSteps - 1 && "rounded-l-none",
                i() > 0 && i() < props.maxSteps - 1 && "rounded-none",
              ])}
              variant={props.val === i() ? "default" : "outline"}
              size={"sm"}
            >
              {i()}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
};

const TurnButtons: Component<{
  val: TurnAction["direction"] | null;
  onChange: (val: TurnAction["direction"]) => void;
}> = (props) => {
  return (
    <div class="flex flex-col">
      <span class="text-xs">Turn:</span>
      <div class="flex ">
        <Button
          onClick={() => props.onChange("left")}
          class={"rounded-r-none border"}
          variant={props.val === "left" ? "default" : "outline"}
          size={"sm"}
        >
          Left
        </Button>
        <Button
          onClick={() => props.onChange("right")}
          class={"rounded-l-none border"}
          variant={props.val === "right" ? "default" : "outline"}
          size={"sm"}
        >
          Right
        </Button>
      </div>
    </div>
  );
};
