import React from 'react';
import { Rabbit } from 'src/types/api';
import { useAnimalAge } from 'src/hooks/useAnimalAge';

interface RabbitCardProps {
  rabbit: Rabbit;
  onEdit?: (rabbit: Rabbit) => void;
  onDelete?: (rabbitId: string) => void;
  onView?: (rabbit: Rabbit) => void;
}

export function RabbitCard({ rabbit, onEdit, onDelete, onView }: RabbitCardProps) {
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

  const age = useAnimalAge(rabbit?.birth_date, 'RABBIT');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView?.(rabbit)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{rabbit.name}</h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            {rabbit.gender && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getGenderColor(rabbit.gender)}`}>
                {rabbit.gender}
              </span>
            )}
            {rabbit.discarded && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Descartado
              </span>
            )}
          </div>
          
          {rabbit.image && (
            <div className="mb-2">
              <img 
                src={rabbit.image} 
                alt={rabbit.name}
                className="w-12 h-12 object-cover rounded"
              />
            </div>
          )}
          
          <div className="space-y-0.5 text-xs text-gray-600">
            <p><span className="font-medium">Nacimiento:</span> {formatDate(rabbit.birth_date)}</p>
            {rabbit.user_id && (
              <p><span className="font-medium">Propietario:</span> {rabbit.user_id}</p>
            )}
            {rabbit.discarded && rabbit.discarded_reason && (
              <p className="text-red-600"><span className="font-medium">Razón:</span> {rabbit.discarded_reason}</p>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mt-2">
            <p>Edad: {age} </p>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(rabbit);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar conejo"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(rabbit.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
