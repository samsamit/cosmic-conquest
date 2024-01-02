import "./App.css";
import { Component } from "solid-js";
import { useAuthStore } from "./contexts/AuthContext";
import { A } from "@solidjs/router";

const App: Component<{}> = () => {
  const [authState, { login, logout }] = useAuthStore();
  return (
    <div>
      <h1>HOME</h1>
      {authState.isAuthenticated ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <A href="/profile">
            <h2>Go to profile</h2>
          </A>
        </>
      ) : (
        <button onClick={() => login()}>Login</button>
      )}
    </div>
  );
};

export default App;
