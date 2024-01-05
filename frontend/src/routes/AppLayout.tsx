import { ParentComponent, Show, createEffect } from "solid-js";
import { useAuthStore } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { A, useMatch, useNavigate } from "@solidjs/router";

const AppLayout: ParentComponent = (props) => {
  const [authState, { logout }] = useAuthStore();
  const navigate = useNavigate();
  const inLogin = useMatch(() => "/login");

  createEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/");
    }
  });

  return (
    <div class="w-screen h-screen grid grid-rows-[min-content_1fr]">
      <div class="flex justify-between py-2 px-4 items-center bg-background border-b-2 border-border">
        <div class="h-9 flex items-center gap-2">
          <A href="/">
            <h1>Cosmic conquest</h1>
          </A>
        </div>
        <Show when={authState.isAuthenticated}>
          <Button size={"sm"} variant={"outline"} onClick={logout}>
            Logout
          </Button>
        </Show>
        <Show when={!authState.isAuthenticated && !Boolean(inLogin())}>
          <Button size={"sm"} variant={"outline"}>
            <A href="/login">Login</A>
          </Button>
        </Show>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default AppLayout;
