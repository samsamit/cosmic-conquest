import { fetchGameUpdate } from "@/api/getUpdate";
import { Entity, GameState, GameStateSchema } from "@/schemas/gameState.schema";
import { BotData, SocketEventSchema } from "@/schemas/socket.schama";
import {
  createContext,
  createEffect,
  createMemo,
  createResource,
  on,
  useContext,
} from "solid-js";
import { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { Position, useWebSocket } from "solidjs-use";

const socketConnectionState = [
  "CONNECTING",
  "OPEN",
  "CLOSING",
  "CLOSED",
] as const;
export interface GameStateStore {
  gameData: {
    entities: Entity[];
    mapWidth: number;
    mapHeight: number;
  } | null;
  bots: BotData[] | null;
  connection: (typeof socketConnectionState)[number];
}

const GameStateContext = createContext<GameStateStore>();

export const GameStateProvider: ParentComponent<{
  connectionToken: string;
}> = (props) => {
  const [gameState, setGameState] = createStore<GameStateStore>({
    gameData: null,
    connection: "CLOSED",
    bots: null,
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
    on(data, (message) => {
      if (!message) return;
      console.log("Message received:", message);
      const eventData = SocketEventSchema.safeParse(JSON.parse(message));
      if (!eventData.success) {
        console.error(eventData.error);
        return;
      }
      const { event, data } = eventData.data;
      switch (event) {
        case "update": {
          setGameState({
            gameData: {
              entities: data.entities,
              mapWidth: data.mapWidth,
              mapHeight: data.mapHeight,
            },
          });
          break;
        }
        case "bots": {
          setGameState({ bots: data.bots });
          break;
        }
      }
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
