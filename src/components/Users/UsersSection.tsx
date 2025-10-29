import React from 'react';
import { useUsers, useSeedUser, useRefetchUsers } from 'src/hooks/useUsers';
import { UsersList } from './UsersList';

export function UsersSection() {
  const { data: users, isLoading, error, isError } = useUsers();
  const seedUserMutation = useSeedUser();
  const refetchUsers = useRefetchUsers();

  const handleSeedUser = () => {
    seedUserMutation.mutate();
  };

  const handleRefetch = () => {
    refetchUsers();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Usuarios</h2>
            <p className="text-sm text-gray-500">Gestiona los usuarios del sistema</p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleSeedUser}
              disabled={seedUserMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {seedUserMutation.isPending ? 'Creando...' : 'Crear Usuario de Prueba'}
            </button>
            
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar usuarios</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Error desconocido'}</p>
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <UsersList users={users || []} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
}
