import { GameStateSchema } from "@/schemas/gameState.schema";
import { createReconnectingWS } from "@solid-primitives/websocket";
import { createContext, useContext } from "solid-js";
import { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

interface GameState {}

const gameStateContext = createContext<GameState>();

export const GameStateContext: ParentComponent<{}> = (props) => {
  const ws = createReconnectingWS("ws://localhost:5000");
  const [gameState, setGameState] = createStore<GameState>({ map: null });
  ws.addEventListener("message", (ev) => {
    const gameState = GameStateSchema.safeParse(JSON.parse(ev.data));
    if (gameState.success) {
      setGameState(gameState.data);
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
