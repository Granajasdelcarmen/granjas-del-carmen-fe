import React from 'react';
import { useUsers, useSeedUser, useRefetchUsers } from '@/hooks/useUsers';

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

  // este sera el layout principal de la aplicación
  // el layout principal debe contener el header, el sidebar y el contenido principal

  return (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Granjas del Carmen</h1>
      
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
        <div className="text-sm text-gray-500 max-w-md">
          <h2 className="font-semibold mb-3 text-center">Usuarios del sistema:</h2>
          <ul className="list-disc list-inside space-y-1">
            {users && users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="mb-1 p-2 bg-gray-50 rounded">
                  <span className="font-medium">{user.name}</span>
                  <br />
                  <span className="text-xs text-gray-400">{user.email}</span>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400 italic">
                No hay usuarios registrados
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Información de estado de React Query */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>Estado: {isLoading ? 'Cargando' : isError ? 'Error' : 'Cargado'}</p>
        {users && <p>Total usuarios: {users.length}</p>}
      </div>
    </div>
  );
}

export default MainLayout;
