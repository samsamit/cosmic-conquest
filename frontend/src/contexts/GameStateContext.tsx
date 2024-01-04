import { Entity, GameState, GameStateSchema } from "@/schemas/gameState.schema";
import { createContext, createEffect, on, useContext } from "solid-js";
import { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { Position, useWebSocket } from "solidjs-use";

const socketConnectionState = [
  "CONNECTING",
  "OPEN",
  "CLOSING",
  "CLOSED",
] as const;
interface GameStateStore {
  data: {
    entities: Entity[];
    mapWidth: number;
    mapHeight: number;
  } | null;
  connection: (typeof socketConnectionState)[number];
}

const GameStateContext = createContext<GameStateStore>();

export const GameStateProvider: ParentComponent<{
  connectionToken: string;
}> = (props) => {
  const [gameState, setGameState] = createStore<GameStateStore>({
    data: null,
    connection: "CLOSED",
  });
  const { status, data } = useWebSocket<string>(
    `${import.meta.env.VITE_WEBSOCKET_PATH}?connectionToken=${
      props.connectionToken
    }`,
    {
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          alert("Failed to connect WebSocket after 3 retries");
        },
      },
    }
  );

  createEffect(on(status, (status) => setGameState("connection", status)));
  createEffect(
    on(data, (data) => {
      if (!data) return;
      console.log("Message received:", data);
      const gameState = GameStateSchema.safeParse(JSON.parse(data));
      if (!gameState.success) {
        console.error(gameState.error);
        return;
      }
      setGameState({
        data: {
          entities: gameState.data.entities,
          mapWidth: gameState.data.mapWidth,
          mapHeight: gameState.data.mapHeight,
        },
      });
    })
  );

  return (
    <GameStateContext.Provider value={gameState}>
      {props.children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const gameState = useContext(GameStateContext);
  if (!gameState) {
    throw new Error("useGameState must be used within a GameStateContext");
  }
  return gameState;
};
