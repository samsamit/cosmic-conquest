import { WebSocketHandler } from "bun";
import { WebSocketData } from "..";

export const socketHandler: WebSocketHandler<WebSocketData> = {
  message: (ws, data) => {
    console.log("message", data);
  },
  close: (ws, code, reason) => {
    console.log("close", code, reason);
  },
  open: (ws) => {
    console.log("open");
  },
};
