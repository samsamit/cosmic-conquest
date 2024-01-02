import { useAuthStore } from "@/contexts/AuthContext";
import { Component } from "solid-js";

const Profile: Component<{}> = (props) => {
  const [authState, { login, logout }] = useAuthStore();
  return (
    <div>
      <h1>Profile page</h1>
      <p>isAuthenticated: {authState.isAuthenticated.toString()}</p>
      <button onClick={() => login()}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Profile;
