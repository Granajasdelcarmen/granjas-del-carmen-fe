import React from 'react';
import { User } from 'src/types/api';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onChangeRole?: (user: User) => void;
}

export function UserCard({ user, onEdit, onDelete, onChangeRole }: UserCardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{user.name || 'Sin nombre'}</h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            {user.is_active ? (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactivo
              </span>
            )}
          </div>
          
          <p className="text-xs text-gray-600 mb-1 truncate">{user.email}</p>
          
          {user.phone && (
            <p className="text-xs text-gray-500 mb-1">📞 {user.phone}</p>
          )}
          
          {user.address && (
            <p className="text-xs text-gray-500 mb-2 truncate">📍 {user.address}</p>
          )}
          
          <div className="text-xs text-gray-400">
            <p>Creado: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
          {onChangeRole && (
            <button
              onClick={() => onChangeRole(user)}
              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Cambiar rol"
            >
              👤
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Editar usuario"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(user.id)}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
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
