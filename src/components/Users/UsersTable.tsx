import React, { useState } from 'react';
import { User, Role } from 'src/types/api';
import { useUpdateUserRole } from 'src/hooks/useUsers';
import { Modal } from 'src/components/Common/Modal';
import { useAuth } from 'src/hooks/useAuth';

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  currentUserId?: string;
}

export function UsersTable({ users, isLoading, currentUserId }: UsersTableProps) {
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: User;
    newRole: Role;
  } | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const updateUserRole = useUpdateUserRole();
  const { user: currentUser } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      case 'trabajador':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuario';
      case 'viewer':
        return 'Visualizador';
      case 'trabajador':
        return 'Trabajador';
      default:
        return role;
    }
  };

  const handleRoleChange = (user: User, newRole: Role) => {
    // No permitir cambiar el rol del propio usuario
    if (user.id === currentUserId) {
      alert('No puedes cambiar tu propio rol');
      return;
    }

    // Si el rol es el mismo, no hacer nada
    if (user.role === newRole) {
      return;
    }

    // Guardar el cambio pendiente y abrir modal de confirmación
    setPendingRoleChange({ user, newRole });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange) return;

    try {
      await updateUserRole.mutateAsync({
        id: pendingRoleChange.user.id,
        role: pendingRoleChange.newRole,
      });
      setIsConfirmModalOpen(false);
      setPendingRoleChange(null);
    } catch (error: any) {
      alert(error?.message || 'Error al actualizar el rol del usuario');
    }
  };

  const handleCancelRoleChange = () => {
    setIsConfirmModalOpen(false);
    setPendingRoleChange(null);
  };

  const roles: Role[] = ['admin', 'user', 'viewer', 'trabajador'];

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!Array.isArray(users) || users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">👥</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
        <p className="text-gray-500">No se encontraron usuarios en el sistema</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isOwnUser = user.id === currentUserId;
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'Sin nombre'}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {isOwnUser ? (
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                            disabled={updateUserRole.isPending}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 ${getRoleColor(user.role)} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {getRoleLabel(role)}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {user.is_active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Activo
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user) => {
          const isOwnUser = user.id === currentUserId;
          return (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">{user.name || 'Sin nombre'}</h3>
                  <p className="text-sm text-gray-500 truncate mt-1">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Rol:</span>
                      {isOwnUser ? (
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                          disabled={updateUserRole.isPending}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getRoleColor(user.role)} cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[32px]`}
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {getRoleLabel(role)}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    {user.is_active ? (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Inactivo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Creado: {new Date(user.created_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelRoleChange}
        title="Confirmar Cambio de Rol"
      >
        <div className="space-y-4">
          {pendingRoleChange && (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  ¿Estás seguro de que deseas cambiar el rol de <span className="font-medium">{pendingRoleChange.user.name || pendingRoleChange.user.email}</span>?
                </p>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rol actual:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(pendingRoleChange.user.role)}`}>
                      {getRoleLabel(pendingRoleChange.user.role)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nuevo rol:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(pendingRoleChange.newRole)}`}>
                      {getRoleLabel(pendingRoleChange.newRole)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelRoleChange}
                  disabled={updateUserRole.isPending}
                  className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRoleChange}
                  disabled={updateUserRole.isPending}
                  className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
                >
                  {updateUserRole.isPending ? 'Actualizando...' : 'Confirmar Cambio'}
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

