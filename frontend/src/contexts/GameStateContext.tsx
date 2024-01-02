import { GameState, GameStateSchema } from "@/schemas/gameState.schema";
import { createContext, useContext } from "solid-js";
import { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

interface GameStateStore {
  gameState: GameState | null;
  connected: boolean;
}

const gameStateContext = createContext<GameStateStore>();

export const GameStateContext: ParentComponent<{
  connectionToken: string;
}> = (props) => {
  const basePath = import.meta.env.VITE_WEBSOCKET_PATH as string;
  const ws = new WebSocket(
    `${basePath}?connectionToken=${props.connectionToken}`
  );

  const [gameState, setGameState] = createStore<GameStateStore>({
    gameState: null,
    connected: false,
  });
  ws.addEventListener("open", () => {
    setGameState({ connected: true });
  });
  ws.addEventListener("close", () => {
    setGameState({ connected: false });
  });
  ws.addEventListener("message", (ev) => {
    const gameState = GameStateSchema.safeParse(JSON.parse(ev.data));
    if (gameState.success) {
      setGameState({ gameState: gameState.data });
    }
  });

  return (
    <gameStateContext.Provider value={gameState}>
      {props.children}
    </gameStateContext.Provider>
  );
};

export const useGameState = () => {
  const gameState = useContext(gameStateContext);
  if (!gameState) {
    throw new Error("useGameState must be used within a GameStateContext");
  }
  return gameState;
};
