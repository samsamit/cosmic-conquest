import { showToast } from "@/components/ui/toast";
import { useNavigate } from "@solidjs/router";
import { createMemo, createSignal } from "solid-js";
import { useWebSocket } from "solidjs-use";

export const createSocketConnection = (connectionToken: string) => {
  const navigate = useNavigate();
  const [lastMessageTimestamp, setLastMessageTimestamp] = createSignal(0);
  const { status, data, send } = useWebSocket<string>(
    `${import.meta.env.VITE_WEBSOCKET_PATH}?connectionToken=${connectionToken}`,
    {
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          showToast({
            title: "Failed to connect WebSocket",
            description: "Retrying...",
            variant: "destructive",
          });
          navigate("/");
        },
      },
      onMessage: () => {
        setLastMessageTimestamp(performance.now());
      },
    }
  );

  const sendData = (data: string) => {
    console.log("sending data", data);
    if (status() === "OPEN") {
      const res = send(data);
      console.log("send result", res);
    } else {
      showToast({
        title: "Failed to send data",
        description: "WebSocket is not connected",
        variant: "destructive",
      });
    }
  };

  const connection = createMemo(() => {
    lastMessageTimestamp();
    return {
      data: data(),
      status: status(),
    };
  });

  return { connection, sendData };
};
