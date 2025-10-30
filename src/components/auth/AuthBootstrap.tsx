import React, { useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';

export function AuthBootstrap() {
  const auth = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/auth/callback') {
      auth.handleAuthCallback().finally(() => {
        window.history.replaceState({}, '', '/');
      });
    } else if (path === '/login') {
      auth.login();
    }
  }, [auth]);

  return null;
}

export default AuthBootstrap;


