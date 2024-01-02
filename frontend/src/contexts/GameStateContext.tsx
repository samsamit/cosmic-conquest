import { createContext, useContext } from "solid-js";
import { ParentComponent } from "solid-js";
interface GameStateType {}

const gameStateContext = createContext<GameStateType>();

export const GameStateContext: ParentComponent<{}> = (props) => {
  return (
    <gameStateContext.Provider value={{}}>
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
