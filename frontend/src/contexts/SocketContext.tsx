import {
  SocketData,
  createSocketConnection,
} from "@/controllers/socketController";
import { ParentComponent, createContext, useContext } from "solid-js";

const socketContext = createContext<SocketData>();

export const SocketContextProvider: ParentComponent<{
  connectionToken: string;
}> = (props) => {
  const socketData = createSocketConnection(props.connectionToken);

  return (
    <socketContext.Provider value={socketData}>
      {props.children}
    </socketContext.Provider>
  );
};

export const useSocketData = () => {
  const socketData = useContext(socketContext);
  if (!socketData) {
    throw new Error("No socket data found");
  }
  return socketData;
};
