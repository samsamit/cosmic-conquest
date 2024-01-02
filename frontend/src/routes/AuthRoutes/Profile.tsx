import { useAuthStore } from "@/contexts/AuthContext";
import { Component } from "solid-js";

const Profile: Component<{}> = () => {
  const [_, { logout }] = useAuthStore();
  return (
    <div>
      <h1>Profile page</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Profile;
