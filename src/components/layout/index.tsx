import React from 'react';
import { Header } from '../Header';
import { useUsers, useSeedUser, useRefetchUsers } from 'src/hooks/useUsers';

function MainLayout() {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Botones de control */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleSeedUser}
              disabled={seedUserMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seedUserMutation.isPending ? 'Creando...' : 'Crear Usuario de Prueba'}
            </button>
            
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Cargando...' : 'Actualizar Lista'}
            </button>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Cargando usuarios...</p>
            </div>
          )}
          
          {/* Estado de error */}
          {isError && (
            <div className="text-center">
              <p className="text-sm text-red-500 mb-2">
                Error al cargar los usuarios: {error?.message || 'Error desconocido'}
              </p>
              <button
                onClick={handleRefetch}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Reintentar
              </button>
            </div>
          )}
          
          {/* Lista de usuarios */}
          {!isLoading && !isError && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Usuarios del sistema</h2>
              <div className="space-y-3">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 italic">
                    No hay usuarios registrados
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
