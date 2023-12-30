export function waitForMessage(socket: WebSocket): Promise<string> {
  return new Promise(function (resolve) {
    socket.onmessage = (event) => {
      resolve(event.data);
    };
    setTimeout(() => {
      resolve("");
    }, 4000);
  });
}
