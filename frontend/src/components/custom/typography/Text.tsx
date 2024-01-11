import clsx from "clsx";
import { Match, ParentComponent, Switch } from "solid-js";

type TextAs = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const Text: ParentComponent<{
  as?: TextAs;
  size?: TextSize;
  class?: string;
}> = (props) => {
  const thisClass = clsx([props.class, props.size && `text-${props.size}`]);
  return (
    <Switch>
      <Match when={props.as === "h1"}>
        <h1 class={thisClass}>{props.children}</h1>
      </Match>
      <Match when={props.as === "h2"}>
        <h2 class={thisClass}>{props.children}</h2>
      </Match>
      <Match when={props.as === "h3"}>
        <h3 class={thisClass}>{props.children}</h3>
      </Match>
      <Match when={props.as === "h4"}>
        <h4 class={thisClass}>{props.children}</h4>
      </Match>
      <Match when={props.as === "h5"}>
        <h5 class={thisClass}>{props.children}</h5>
      </Match>
      <Match when={props.as === "h6"}>
        <h6 class={thisClass}>{props.children}</h6>
      </Match>
      <Match when={props.as === "p"}>
        <p class={thisClass}>{props.children}</p>
      </Match>
      <Match when={props.as === "span"}>
        <span class={thisClass}>{props.children}</span>
      </Match>
      <Match when={props.as === undefined}>
        <span class={thisClass}>{props.children}</span>
      </Match>
    </Switch>
  );
};

export default Text;
