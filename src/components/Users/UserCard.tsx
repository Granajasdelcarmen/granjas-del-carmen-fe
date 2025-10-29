import React from 'react';
import { User } from 'src/types/api';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{user.name || 'Sin nombre'}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            {user.is_active ? (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactivo
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-2">{user.email}</p>
          
          {user.phone && (
            <p className="text-sm text-gray-500 mb-2">📞 {user.phone}</p>
          )}
          
          {user.address && (
            <p className="text-sm text-gray-500 mb-3">📍 {user.address}</p>
          )}
          
          <div className="text-xs text-gray-400">
            <p>Creado: {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(user.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar usuario"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar usuario"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
