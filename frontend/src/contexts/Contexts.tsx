import { ParentComponent } from "solid-js";
import { AuthContext } from "@contexts/AuthContext.tsx";

const Contexts: ParentComponent<{}> = (props) => {
  return <AuthContext>{props.children}</AuthContext>;
};

export default Contexts;
