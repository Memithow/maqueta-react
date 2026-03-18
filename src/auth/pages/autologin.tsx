import { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context.ts';
import { useParams } from 'react-router';
import { Navigate } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader.tsx';

function AutoLogin() {
  const { token_auth } = useParams();
  const { login, loading } = useAuth();
  const { VITE_SSO_LOGIN } = import.meta.env;

  useEffect(() => {
    async function ssoAutologin() {
      if (token_auth) {
        await login(token_auth);
      } else {
        window.location.href = VITE_SSO_LOGIN;
      }
    }

    ssoAutologin();
  }, []);

  if (loading) {
    return <ScreenLoader />;
  }

  return <Navigate to="/" replace />;
}

export default AutoLogin;
