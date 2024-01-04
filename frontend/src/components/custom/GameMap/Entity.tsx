import {
  Entity,
  isExplosion,
  isProjectile,
  isShip,
} from "@/schemas/gameState.schema";
import { getRotation } from "@/utils/direction.functions";
import { VsRocket } from "solid-icons/vs";
import { Component, Match, Show, Switch, createMemo } from "solid-js";
import EntityHoverCard from "./EntityHoverCard";

const EntityCell: Component<{
  entity: Entity;
  cellSize: number;
}> = (props) => {
  const entityPosition = createMemo(() => {
    const { x, y } = props.entity.position;
    const cellSize = props.cellSize;
    const xPosition = x * cellSize;
    const yPosition = y * cellSize;
    return {
      left: `${xPosition}px`,
      top: `${yPosition}px`,
    };
  });

  return (
    <Show when={entityPosition()}>
      {(position) => (
        <div
          class="absolute"
          style={{
            height: `${props.cellSize}px`,
            width: `${props.cellSize}px`,
            ...position(),
            "transition-property": "left, top",
            "transition-duration": "0.5s",
            "transition-timing-function": "ease-in-out",
          }}
        >
          <EntityHoverCard entity={props.entity}>
            <Switch>
              <Match when={isShip(props.entity) ? props.entity : false}>
                {(ship) => (
                  <VsRocket
                    class="w-3/5 h-3/5"
                    style={{
                      transform: `rotate(${getRotation(ship().direction)}deg)`,
                      "transition-property": "transform",
                      "transition-duration": "0.5s",
                      "transition-timing-function": "ease-in-out",
                    }}
                  />
                )}
              </Match>
              <Match when={isProjectile(props.entity) ? props.entity : false}>
                {(projectile) => <div>{props.entity.id}</div>}
              </Match>
              <Match when={isExplosion(props.entity) ? props.entity : false}>
                {(explosion) => <div>{props.entity.id}</div>}
              </Match>
            </Switch>
          </EntityHoverCard>
        </div>
      )}
    </Show>
  );
};

export default EntityCell;
