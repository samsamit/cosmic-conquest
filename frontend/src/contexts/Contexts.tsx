import { ParentComponent } from "solid-js";
import { AuthContext } from "@contexts/AuthContext.tsx";
import { SocketContextProvider } from "./SocketContext";

const Contexts: ParentComponent<{}> = (props) => {
  return (
    <AuthContext>
      <SocketContextProvider>{props.children}</SocketContextProvider>
    </AuthContext>
  );
};

export default Contexts;
