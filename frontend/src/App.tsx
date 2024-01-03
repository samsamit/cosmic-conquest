import "./App.css";
import { Component } from "solid-js";
import { useAuthStore } from "./contexts/AuthContext";
import { A } from "@solidjs/router";
import { Button } from "./components/ui/button";
import ColorModeButton from "./components/custom/ColorModeButton";

const App: Component<{}> = () => {
  const [authState, { login, logout }] = useAuthStore();
  return (
    <div>
      <h1>HOME</h1>
      <ColorModeButton />
      {authState.isAuthenticated ? (
        <>
          <Button class="" onClick={() => logout()}>
            Logout
          </Button>
          <A href="/profile">
            <h2>Go to profile</h2>
          </A>
          <A href="/game">
            <h2>Go to game</h2>
          </A>
        </>
      ) : (
        <Button onClick={() => login("token")}>Login</Button>
      )}
    </div>
  );
};

export default App;
