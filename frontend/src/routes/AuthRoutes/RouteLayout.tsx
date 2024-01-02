import { useAuthStore } from "@/contexts/AuthContext";
import { Navigate } from "@solidjs/router";
import { ParentComponent, createEffect } from "solid-js";

const RouteGuard: ParentComponent<{}> = (props) => {
  const [authState] = useAuthStore();
  createEffect(() => {
    if (!authState.isAuthenticated) {
      return <Navigate href="/" />;
    }
  });
  return (
    <>
      <h1>isAuth: {authState.isAuthenticated.toString()} </h1>
      {props.children}
    </>
  );
};

export default RouteGuard;
