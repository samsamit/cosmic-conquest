import { showToast } from "@/components/ui/toast";
import { useAuthStore } from "@/contexts/AuthContext";
import { GameStateProvider, useGameState } from "@/contexts/GameStateContext";
import {
  SocketConnectionHandler,
  useSocketData,
} from "@/contexts/SocketContext";
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
        <SocketConnectionHandler connectionToken={token()}>
          <GameStateProvider>
            <HandleSocketEvents>{props.children}</HandleSocketEvents>
          </GameStateProvider>
        </SocketConnectionHandler>
      )}
    </Show>
  );
};

const HandleSocketEvents: ParentComponent<{}> = (props) => {
  const [socketData] = useSocketData();
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
            socketData.error &&
              showToast({
                title: "Something went wrong",
                description: socketData.error,
                variant: "destructive",
              });
        }
      }
    )
  );

  return <>{props.children}</>;
};

export default RouteGuard;
