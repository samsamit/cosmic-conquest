import { Button, ButtonProps } from "@/components/ui/button";
import { A } from "@solidjs/router";
import { ParentComponent, splitProps } from "solid-js";
import { twMerge } from "tailwind-merge";

const LinkButton: ParentComponent<{ href: string } & ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["href", "children", "class"]);
  return (
    <A href={local.href}>
      <Button {...others} class={twMerge(local.class, "w-full")}>
        {local.children}
      </Button>
    </A>
  );
};

export default LinkButton;
