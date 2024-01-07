import {
  HoverCardTrigger,
  HoverCardContent,
  HoverCard,
} from "@/components/ui/hover-card";
import { Entity, isProjectile, isShip } from "@/schemas/gameState.schema";

import { Match, ParentComponent, Switch } from "solid-js";

const EntityHoverCard: ParentComponent<{ entity: Entity }> = (props) => {
  return (
    <HoverCard>
      <HoverCardTrigger class="flex justify-center items-center w-full h-full cursor-pointer">
        {props.children}
      </HoverCardTrigger>
      <HoverCardContent class="w-min text-xs flex flex-col text-nowrap">
        <Switch>
          <Match when={isShip(props.entity) ? props.entity : false}>
            {(entity) => (
              <>
                <p>Type: {entity().type}</p>
                <p>Id: {entity().id}</p>
                <p>Team: {entity().team}</p>
                <p>Dir: {entity().direction}</p>
                {entity().manualControl && <p>Manual control</p>}
                <p>
                  x: {entity().position.x}, y: {entity().position.y}
                </p>
              </>
            )}
          </Match>
          <Match when={isProjectile(props.entity) ? props.entity : false}>
            {(entity) => (
              <>
                <p>Type: {entity().type}</p>
                <p>Dir: {entity().direction}</p>
                <p>Mass: {entity().mass}</p>
                <p>Speed: {entity().speed}</p>
                <p>
                  x: {entity().position.x}, y: {entity().position.y}
                </p>
              </>
            )}
          </Match>
        </Switch>
      </HoverCardContent>
    </HoverCard>
  );
};

export default EntityHoverCard;
