import { useEffect, useRef, useState } from 'react';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';
import { Outlet } from 'react-router';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
  const { auth, verify, loading: globalLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const verificationStarted = useRef(false);
  const { VITE_SSO_LOGIN } = import.meta.env;

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth?.token || !verificationStarted.current) {
        verificationStarted.current = true;
        try {
          await verify();
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [auth, verify]);

  // Show screen loader while checking authentication
  if (loading || globalLoading) {
    return <ScreenLoader />;
  }

  // If not authenticated, redirect to login
  if (!auth?.token && !loading) {
    window.location.href = VITE_SSO_LOGIN;
  }

  // If authenticated, render child routes
  return <Outlet />;
};
