import { SocketEvent, SocketEventSchema } from "@/schemas/socket.schama";
import { createComputed } from "solid-js";
import { createStore } from "solid-js/store";
import { WebSocketStatus, useWebSocket } from "solidjs-use";

export interface SocketData {
  connectionState: WebSocketStatus;
  payload: SocketEvent | null;
  error?: string;
}

export const createSocketConnection = (connectionToken: string): SocketData => {
  const [socketData, setSocketData] = createStore<SocketData>({
    connectionState: "CLOSED",
    payload: null,
  });
  const { status, data } = useWebSocket<string>(
    `${import.meta.env.VITE_WEBSOCKET_PATH}?connectionToken=${connectionToken}`,
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
  createComputed(() => {
    const socketData = data();
    if (!socketData) return;
    const parsedData = SocketEventSchema.safeParse(JSON.parse(socketData));

    if (parsedData.success) {
      console.log("Got socket event: ", parsedData.data.event);
      setSocketData({
        connectionState: status(),
        payload: parsedData.data,
      });
    } else {
      setSocketData({
        connectionState: status(),
        payload: null,
        error: parsedData.error.message,
      });
    }
  });
  return socketData;
};
