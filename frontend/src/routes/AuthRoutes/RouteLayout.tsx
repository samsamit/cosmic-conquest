import { useAuthStore } from "@/contexts/AuthContext";
import { GameStateProvider, useGameState } from "@/contexts/GameStateContext";
import { SocketContextProvider, useSocketData } from "@/contexts/SocketContext";
import { Navigate } from "@solidjs/router";
import {
  ParentComponent,
  Show,
  createComputed,
  createEffect,
  on,
} from "solid-js";

const RouteGuard: ParentComponent<{}> = (props) => {
  const [authState] = useAuthStore();
  createEffect(() => {
    if (!authState.isAuthenticated || !authState.connectionToken) {
      return <Navigate href="/login" />;
    }
  });
  return (
    <Show when={authState.connectionToken}>
      {(token) => (
        <SocketContextProvider connectionToken={token()}>
          <GameStateProvider>
            <HandleSocketEvents>{props.children}</HandleSocketEvents>
          </GameStateProvider>
        </SocketContextProvider>
      )}
    </Show>
  );
};

const HandleSocketEvents: ParentComponent<{}> = (props) => {
  const socketData = useSocketData();
  const [, { handleGameEvent }] = useGameState();
  const [, { updateInfo }] = useAuthStore();

  createComputed(
    on(
      () => socketData.payload,
      () => {
        switch (socketData.payload?.event) {
          case "connectionInfo": {
            updateInfo(socketData.payload.data.teamName);
            return;
          }
          case "update":
          case "bots": {
            handleGameEvent(socketData.payload);
            return;
          }
          case null:
            socketData.error && alert(socketData.error);
        }
      }
    )
  );

  return <>{props.children}</>;
};

export default RouteGuard;
