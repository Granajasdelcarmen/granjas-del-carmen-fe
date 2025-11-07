import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { Role } from 'src/types/api';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  fallback?: React.ReactNode;
}

/**
 * Component that protects content based on user roles
 * Only renders children if user has one of the allowed roles
 */
export function RoleGate({ children, allowedRoles, fallback }: RoleGateProps): React.ReactElement {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          <span>Verificando permisos...</span>
        </div>
      </div>
    );
  }

  if (!user || !(user as any).role) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No tienes permisos para acceder a esta sección.</p>
          <p className="text-sm text-gray-500">Contacta a un administrador para obtener acceso.</p>
        </div>
      </div>
    ) as React.ReactElement;
  }

  const userRole = (user as any).role as Role;

  if (!allowedRoles.includes(userRole)) {
    if (fallback) {
      return fallback as React.ReactElement;
    }
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-2">No tienes permisos para acceder a esta sección.</p>
          <p className="text-sm text-gray-500">
            Se requiere uno de los siguientes roles: {allowedRoles.join(', ')}
          </p>
          <p className="text-sm text-gray-500 mt-2">Tu rol actual: {userRole}</p>
        </div>
      </div>
    ) as React.ReactElement;
  }

  return <>{children}</> as React.ReactElement;
}

