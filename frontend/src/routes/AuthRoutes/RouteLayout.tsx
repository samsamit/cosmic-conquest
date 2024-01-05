import { useAuthStore } from "@/contexts/AuthContext";
import { GameStateProvider } from "@/contexts/GameStateContext";
import { Navigate } from "@solidjs/router";
import { ParentComponent, createEffect } from "solid-js";

const RouteGuard: ParentComponent<{}> = (props) => {
  const [authState] = useAuthStore();
  createEffect(() => {
    if (!authState.isAuthenticated) {
      return <Navigate href="/login" />;
    }
  });
  return (
    <GameStateProvider connectionToken={authState.connectionToken}>
      {props.children}
    </GameStateProvider>
  );
};

export default RouteGuard;
