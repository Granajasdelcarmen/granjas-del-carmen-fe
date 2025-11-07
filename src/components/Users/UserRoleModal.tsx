import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useUpdateUserRole } from 'src/hooks/useUsers';
import { User, Role } from 'src/types/api';

interface UserRoleModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export function UserRoleModal({ user, isOpen, onClose, currentUserId }: UserRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(user?.role || 'user');
  const updateUserRole = useUpdateUserRole();
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
      setError(null);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // No permitir cambiar el rol del propio usuario
    if (user.id === currentUserId) {
      setError('No puedes cambiar tu propio rol');
      return;
    }

    if (selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      await updateUserRole.mutateAsync({
        id: user.id,
        role: selectedRole,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al actualizar el rol del usuario');
    }
  };

  if (!user) return null;

  const isOwnUser = user.id === currentUserId;
  const roles: Role[] = ['admin', 'user', 'viewer', 'trabajador'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Cambiar Rol: ${user.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Usuario: <span className="font-medium">{user.email}</span>
          </p>
          {isOwnUser && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ No puedes cambiar tu propio rol por seguridad.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Rol del Usuario
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role)}
            disabled={isOwnUser || updateUserRole.isPending}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'admin' && 'Administrador'}
                {role === 'user' && 'Usuario'}
                {role === 'viewer' && 'Visualizador'}
                {role === 'trabajador' && 'Trabajador'}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
            onClick={onClose}
            disabled={updateUserRole.isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isOwnUser || selectedRole === user.role || updateUserRole.isPending}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
          >
            {updateUserRole.isPending ? 'Guardando...' : 'Actualizar Rol'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

