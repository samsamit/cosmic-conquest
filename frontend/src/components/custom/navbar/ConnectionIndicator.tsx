import { Badge } from "@/components/ui/badge";
import { useSocketData } from "@/contexts/SocketContext";
import { Component, Match, Switch } from "solid-js";

const ConnectionIndicator: Component<{}> = () => {
  const [socketData] = useSocketData();

  return (
    <Switch>
      <Match when={socketData.connectionState === "OPEN"}>
        <Badge color="green">Connected</Badge>
      </Match>
      <Match when={socketData.connectionState === "CLOSED"}>
        <Badge color="red">Disconnected</Badge>
      </Match>
      <Match when={socketData.connectionState === "CONNECTING"}>
        <Badge color="yellow">Connecting</Badge>
      </Match>
    </Switch>
  );
};

export default ConnectionIndicator;
