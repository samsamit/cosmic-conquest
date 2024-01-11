import Text from "@/components/custom/typography/Text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/contexts/AuthContext";
import { useNavigate } from "@solidjs/router";
import { Component, Show, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const Login: Component = () => {
  const [_, { login }] = useAuthStore();
  const [team, setTeam] = createSignal("");
  const [token, setToken] = createSignal("");
  const [errors, setErrors] = createStore<{
    team: string | null;
    token: string | null;
  }>({ team: null, token: null });
  const navigate = useNavigate();

  const handleLogin = () => {
    const res = login(token(), team());
    if (!res.success) {
      setErrors(res.errors);
      return;
    }
    navigate("/");
  };
  return (
    <div class="container pt-4 flex flex-col gap-4">
      <h1>Login page</h1>
      <form
        class="flex flex-col gap-4"
        onSubmit={(e) => {
          handleLogin();
          e.preventDefault();
        }}
      >
        <div class="flex flex-col gap-1">
          <Label>Team name:</Label>
          <Input
            class={errors.team ? "border border-destructive " : undefined}
            value={team()}
            onChange={(e) => {
              e.preventDefault();
              setTeam(e.currentTarget.value);
              setErrors({ team: null, token: null });
            }}
          />
          <Show when={errors.team}>
            <Text class="text-destructive" size="xs">
              {errors.team}
            </Text>
          </Show>
        </div>
        <div class="flex flex-col gap-1">
          <Label>Connection token:</Label>
          <Input
            value={token()}
            onChange={(e) => {
              e.preventDefault;
              setToken(e.currentTarget.value);
              setErrors({ team: null, token: null });
            }}
            class={errors.token ? "border border-destructive " : undefined}
          />
          <Show when={errors.token}>
            <Text class="text-destructive" size="xs">
              {errors.token}
            </Text>
          </Show>
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
