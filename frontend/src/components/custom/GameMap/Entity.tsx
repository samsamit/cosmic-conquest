import {
  Entity,
  isExplosion,
  isProjectile,
  isShip,
} from "@/schemas/gameState.schema";
import { Component, Match, Switch } from "solid-js";

const EntityCell: Component<{ entity: Entity }> = (props) => {
  return (
    <Switch>
      <Match when={isShip(props.entity) ? props.entity : false}>
        {(ship) => <div>ship</div>}
      </Match>
      <Match when={isProjectile(props.entity) ? props.entity : false}>
        {(projectile) => <div>{props.entity.id}</div>}
      </Match>
      <Match when={isExplosion(props.entity) ? props.entity : false}>
        {(explosion) => <div>{props.entity.id}</div>}
      </Match>
    </Switch>
  );
};

export default EntityCell;
