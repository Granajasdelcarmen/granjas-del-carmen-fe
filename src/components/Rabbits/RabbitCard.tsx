import React from 'react';
import { Rabbit } from 'src/types/api';

interface RabbitCardProps {
  rabbit: Rabbit;
  onEdit?: (rabbit: Rabbit) => void;
  onDelete?: (rabbitId: string) => void;
}

export function RabbitCard({ rabbit, onEdit, onDelete }: RabbitCardProps) {
  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return '♂️';
      case 'FEMALE':
        return '♀️';
      default:
        return '🐰';
    }
  };

  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return 'bg-blue-100 text-blue-800';
      case 'FEMALE':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{rabbit.name}</h3>
            <span className="text-2xl">{getGenderIcon(rabbit.gender)}</span>
            {rabbit.gender && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(rabbit.gender)}`}>
                {rabbit.gender}
              </span>
            )}
            {rabbit.discarded && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Descartado
              </span>
            )}
          </div>
          
          {rabbit.image && (
            <div className="mb-3">
              <img 
                src={rabbit.image} 
                alt={rabbit.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Fecha de nacimiento:</strong> {formatDate(rabbit.birth_date)}</p>
            {rabbit.user_id && (
              <p><strong>Propietario ID:</strong> {rabbit.user_id}</p>
            )}
            {rabbit.discarded && rabbit.discarded_reason && (
              <p className="text-red-600"><strong>Razón de descarte:</strong> {rabbit.discarded_reason}</p>
            )}
          </div>
          
          <div className="text-xs text-gray-400 mt-3">
            <p>Creado: {new Date(rabbit.created_at).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(rabbit.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(rabbit)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar conejo"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(rabbit.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar conejo"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
