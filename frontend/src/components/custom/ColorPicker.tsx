import { Component, For } from "solid-js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { As } from "@kobalte/core";
import { Button } from "../ui/button";

const ColorPicker: Component<{
  value: string;
  colors: string[];
  onChange: (color: string) => void;
}> = (props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <As
          size={"sm"}
          style={{ "background-color": props.value ?? props.colors[0] }}
          component={Button}
        >
          Choose color
        </As>
      </PopoverTrigger>
      <PopoverContent>
        <div class="flex flex-wrap gap-1">
          <For each={props.colors}>
            {(color) => (
              <Button
                size={"sm"}
                style={{ "background-color": color }}
                onClick={() => props.onChange(color)}
              />
            )}
          </For>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
