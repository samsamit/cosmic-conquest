import { ParentComponent, createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

interface AuthState {
  isAuthenticated: boolean;
}
const InitialAuthState: AuthState = {
  isAuthenticated: false,
};

const makeAuthContext = (initialState: AuthState) => {
  const [state, setState] = createStore(initialState);
  const authStateFunctions = {
    login: () => {
      setState({ isAuthenticated: true });
    },
    logout: () => {
      setState({ isAuthenticated: false });
    },
  };
  return [state, authStateFunctions] as const;
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
