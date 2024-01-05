import { createLocalStore } from "@/utils/createLocalStore";
import { ParentComponent, createContext, useContext } from "solid-js";

interface AuthState {
  isAuthenticated: boolean;
  teamName: string | null;
  connectionToken: string | null;
}
const InitialAuthState: AuthState = {
  isAuthenticated: false,
  connectionToken: null,
  teamName: null,
};

const makeAuthContext = (initialState: AuthState) => {
  const [authState, setAuthState] = createLocalStore("auth", initialState);
  const authStateFunctions = {
    login: (
      token: string,
      team: string
    ): { success: boolean; errors: Record<string, string> } => {
      const errors: Record<string, string> = {};
      if (token === "") {
        errors.token = "Token is required";
      }
      if (team === "") {
        errors.team = "Team is required";
      }
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }
      setAuthState({
        connectionToken: token,
        isAuthenticated: true,
        teamName: team,
      });
      return { success: true, errors };
    },
    logout: () => {
      setAuthState({
        isAuthenticated: false,
        connectionToken: null,
        teamName: null,
      });
    },
  };
  return [authState, authStateFunctions] as const;
};

const authContext = createContext<ReturnType<typeof makeAuthContext>>(
  makeAuthContext(InitialAuthState)
);

export const AuthContext: ParentComponent<{}> = (props) => {
  return (
    <authContext.Provider value={makeAuthContext(InitialAuthState)}>
      {props.children}
    </authContext.Provider>
  );
};

export const useAuthStore = () => {
  const authState = useContext(authContext);
  if (!authState) {
    throw new Error("authStore is not initialized!");
  }
  return authState;
};
