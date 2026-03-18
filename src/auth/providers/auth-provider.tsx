import { useEffect, useState, type PropsWithChildren } from 'react';
import SSOClient from '@/api/services/SSOClient.ts';
import SSOServerClient from '@/api/services/SSOServerClient.ts';
import { AuthContext } from '@/auth/context/auth-context';
import * as authHelper from '@/auth/lib/helpers';

// Define the Auth Provider
export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<SessionInterface | undefined>(
    authHelper.getAuth(),
  );
  const [currentUser, setCurrentUser] = useState<UserInterface | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  const sso_client = new SSOClient();
  const ssos_client = new SSOServerClient();

  // Check if user is admin
  useEffect(() => {
    setIsAdmin(currentUser?.is_admin === true);
  }, [currentUser]);

  const verify = async () => {
    if (auth) {
      try {
        const user = await getUser();
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  const saveAuth = (umo_session: UMOUserInterface | undefined) => {
    if (umo_session?.session) {
      setAuth(umo_session?.session);
      authHelper.setAuth(umo_session.session);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (token_auth: string) => {
    try {
      const umo = await ssos_client.getUMOUser(token_auth);

      if (!umo.session.token || !umo.session.token.length) {
        throw new Error('Token de autenticación inválido');
      }

      if (!umo.user || !umo.user.sso) {
        throw new Error('Autenticación de usuario inválido');
      }

      saveAuth(umo);
      setCurrentUser(umo.user);
    } catch (error) {
      console.error(error);
      saveAuth(undefined);
      throw error;
    }
  };

  const getUser = async () => {
    return sso_client.current();
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        saveAuth,
        user: currentUser,
        setUser: setCurrentUser,
        login,
        getUser,
        verify,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
