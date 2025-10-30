import React from 'react';
import { useAuth } from 'src/hooks/useAuth';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!auth.user || !(auth.user as any).sub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <button
          onClick={() => auth.login()}
          disabled={auth.isLoggingIn}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {auth.isLoggingIn ? 'Redirigiendo…' : 'Iniciar sesión'}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGate;


