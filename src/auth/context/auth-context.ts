import { createContext, useContext } from 'react';

// Create AuthContext with types
export const AuthContext = createContext<{
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  auth?: SessionInterface;
  saveAuth: (auth: SessionInterface | undefined) => void;
  user?: UserInterface;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | undefined>>;
  login: (token: string) => Promise<void>;
  getUser: () => Promise<UserInterface | null>;
  verify: () => Promise<void>;
  isAdmin: boolean;
}>({
  loading: false,
  setLoading: () => {},
  saveAuth: () => {},
  setUser: () => {},
  login: async () => {},
  getUser: async () => null,
  verify: async () => {},
  isAdmin: false,
});

// Hook definition
export function useAuth() {
  return useContext(AuthContext);
}
