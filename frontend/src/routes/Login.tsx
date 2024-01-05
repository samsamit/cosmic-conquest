import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/contexts/AuthContext";
import { useNavigate } from "@solidjs/router";
import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const Login: Component = () => {
  const [_, { login }] = useAuthStore();
  const [team, setTeam] = createSignal("");
  const [token, setToken] = createSignal("");
  const [errors, setErrors] = createStore<Record<string, string>>({});
  const navigate = useNavigate();

  const handleLogin = () => {
    const res = login(token(), team());
    if (!res.success) {
      setErrors(res.errors);
      return;
    }
    navigate("/profile");
  };
  return (
    <div class="container pt-4 flex flex-col gap-4">
      <h1>Login page</h1>
      <div class="flex flex-col gap-1">
        <Label>Team name:</Label>
        <Input
          class={errors["team"] && "border border-destructive "}
          value={team()}
          onChange={(e) => setTeam(e.currentTarget.value)}
        />
      </div>
      <div class="flex flex-col gap-1">
        <Label>Connection token:</Label>
        <Input
          value={token()}
          onChange={(e) => setToken(e.currentTarget.value)}
          class={errors["token"] && "border border-destructive "}
        />
      </div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
