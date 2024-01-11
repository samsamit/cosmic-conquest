import { showToast } from "@/components/ui/toast";
import { createSocketConnection } from "@/controllers/socketController";
import { ClientAction } from "@/schemas/action.schema";
import { SocketEvent, SocketEventSchema } from "@/schemas/socket.schama";
import {
  ParentComponent,
  createComputed,
  createContext,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { WebSocketStatus } from "solidjs-use";

export interface SocketData {
  send: ((data: string) => void) | null;
  connectionState: WebSocketStatus;
  payload: SocketEvent | null;
}
interface SocketFunctions {
  sendManualAction: (action: ClientAction) => void;
  updateSocketData: (newData: Partial<SocketData>) => void;
}

type SocketContext = [SocketData, SocketFunctions];

const socketContext = createContext<SocketContext>();

export const SocketContextProvider: ParentComponent<{}> = (props) => {
  const [socketData, setSocketData] = createStore<SocketData>({
    send: null,
    connectionState: "CLOSED",
    payload: null,
  });

  const sendManualAction = (action: ClientAction) => {
    if (socketData.send === null) {
      throw new Error("No websocket connection");
    }
    socketData.send(JSON.stringify(action));
  };

  const updateSocketData = (newData: Partial<SocketData>) => {
    setSocketData(newData);
  };

  return (
    <socketContext.Provider
      value={[socketData, { sendManualAction, updateSocketData }]}
    >
      {props.children}
    </socketContext.Provider>
  );
};

export const SocketConnectionHandler: ParentComponent<{
  connectionToken: string;
}> = (props) => {
  const { connection, sendData } = createSocketConnection(
    props.connectionToken
  );
  const [, { updateSocketData }] = useSocketData();

  createComputed(() => {
    updateSocketData({
      connectionState: connection().status,
      send: sendData,
    });
  });

  createComputed(() => {
    const socketData = connection().data;
    if (!socketData) return;
    const parsedData = SocketEventSchema.safeParse(JSON.parse(socketData));

    if (parsedData.success) {
      console.log("Got socket event: ", parsedData.data.event);
      console.log(parsedData.data);
      if (parsedData.data.event === "error") {
        updateSocketData({
          connectionState: connection().status,
          payload: null,
        });
        showToast({
          title: "Action error",
          description: parsedData.data.message,
          variant: "destructive",
        });
        return;
      }
      updateSocketData({
        connectionState: connection().status,
        payload: parsedData.data,
      });
    } else {
      updateSocketData({
        connectionState: connection().status,
        payload: null,
      });
      showToast({
        title: "Socket error",
        description: "Error parsing socket data",
        variant: "destructive",
      });
    }
  });

  return <>{props.children}</>;
};

export const useSocketData = () => {
  const socketData = useContext(socketContext);
  if (!socketData) {
    throw new Error("No socket data found");
  }
  return socketData;
};
