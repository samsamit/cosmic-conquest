import { GameUpdate } from "@/schemas/gameState.schema";
import { BotData, SocketEvent } from "@/schemas/socket.schama";
import { createContext, useContext } from "solid-js";
import { ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { WebSocketStatus } from "solidjs-use";
export interface GameStateStore {
  gameData: GameUpdate | null;
  bots: BotData[] | null;
  connection: WebSocketStatus;
  gameId: string | null;
}

interface GameStateFunctions {
  setGameId: (gameId: string) => void;
  handleGameEvent: (
    eventData: Exclude<
      SocketEvent,
      | {
          event: "connectionInfo";
        }
      | {
          event: "error";
        }
    >
  ) => void;
}

const GameStateContext = createContext<[GameStateStore, GameStateFunctions]>();

export const GameStateProvider: ParentComponent = (props) => {
  const [gameState, setGameState] = createStore<GameStateStore>({
    gameData: null,
    connection: "CLOSED",
    bots: null,
    gameId: null,
  });

  const functions: GameStateFunctions = {
    setGameId: (gameId) => {
      setGameState({ gameId });
    },
    handleGameEvent: (eventData) => {
      const { event, data } = eventData;
      switch (event) {
        case "update": {
          setGameState({
            gameData: data,
          });
          break;
        }
        case "bots": {
          setGameState({ bots: data.bots });
          break;
        }
      }
    },
  };

  return (
    <GameStateContext.Provider value={[gameState, functions]}>
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
