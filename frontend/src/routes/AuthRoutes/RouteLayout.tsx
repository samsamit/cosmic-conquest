import { useAuthStore } from "@/contexts/AuthContext";
import { GameStateContext } from "@/contexts/GameStateContext";
import { Navigate } from "@solidjs/router";
import { ParentComponent, createEffect } from "solid-js";

const RouteGuard: ParentComponent<{}> = (props) => {
  const [authState] = useAuthStore();
  createEffect(() => {
    if (!authState.isAuthenticated) {
      return <Navigate href="/" />;
    }
  });
  return (
    <GameStateContext connectionToken={authState.connectionToken}>
      <h1>isAuth: {authState.isAuthenticated.toString()} </h1>
      {props.children}
    </GameStateContext>
  );
};

export default RouteGuard;
