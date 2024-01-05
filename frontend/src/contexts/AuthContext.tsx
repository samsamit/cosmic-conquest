import { createLocalStore } from "@/utils/createLocalStore";
import { ParentComponent, createContext, useContext } from "solid-js";

interface AuthState {
  isAuthenticated: boolean;
  teamName: string | null;
  connectionToken: string | null;
}
const initialAuthState: AuthState = {
  isAuthenticated: false,
  connectionToken: null,
  teamName: null,
};

interface AuthFunctions {
  login: (
    token: string,
    team: string
  ) => { success: boolean; errors: Record<string, string> };
  logout: () => void;
  updateInfo: (teamName: string) => void;
}

const authContext = createContext<[AuthState, AuthFunctions]>();

export const AuthContext: ParentComponent<{}> = (props) => {
  const [authState, setAuthState] = createLocalStore("auth", initialAuthState);
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
    updateInfo: (teamName: string) => {
      setAuthState({ teamName });
    },
  };
  return (
    <authContext.Provider value={[authState, authStateFunctions]}>
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
