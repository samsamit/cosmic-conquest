import { Button } from "@/components/ui/button";
import { AiOutlineMinus, AiOutlinePlus } from "solid-icons/ai";
import { Component } from "solid-js";
import { twMerge } from "tailwind-merge";

const ValueButton: Component<{
  onIncrease: () => void;
  onDecrease: () => void;
  class?: string;
}> = (props) => {
  const containerClass = twMerge(props.class, "flex");
  return (
    <div class={containerClass}>
      <Button size={"sm"} class="rounded-r-none" onClick={props.onIncrease}>
        <AiOutlinePlus />
      </Button>
      <Button size={"sm"} class="rounded-l-none" onClick={props.onDecrease}>
        <AiOutlineMinus />
      </Button>
    </div>
  );
};

export default ValueButton;
