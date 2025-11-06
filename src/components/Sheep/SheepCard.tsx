import React from 'react';
import { Sheep } from 'src/types/api';
import { useAnimalAge } from 'src/hooks/useAnimalAge';

interface SheepCardProps {
  sheep: Sheep;
  onEdit?: (sheep: Sheep) => void;
  onDelete?: (sheepId: string) => void;
  onView?: (sheep: Sheep) => void;
}

export function SheepCard({ sheep, onEdit, onDelete, onView }: SheepCardProps) {
  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return '♂️';
      case 'FEMALE':
        return '♀️';
      default:
        return '🐑';
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

  const age = useAnimalAge(sheep?.birth_date, 'SHEEP');

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView?.(sheep)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{sheep.name}</h3>
            <span className="text-lg flex-shrink-0">{getGenderIcon(sheep.gender)}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            {sheep.gender && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getGenderColor(sheep.gender)}`}>
                {sheep.gender}
              </span>
            )}
            {sheep.discarded && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Descartado
              </span>
            )}
          </div>
          
          {sheep.image && (
            <div className="mb-2">
              <img 
                src={sheep.image} 
                alt={sheep.name}
                className="w-12 h-12 object-cover rounded"
              />
            </div>
          )}
          
          <div className="space-y-0.5 text-xs text-gray-600">
            <p><span className="font-medium">Nacimiento:</span> {formatDate(sheep.birth_date)}</p>
            {sheep.user_id && (
              <p><span className="font-medium">Propietario:</span> {sheep.user_id}</p>
            )}
            {sheep.discarded && sheep.discarded_reason && (
              <p className="text-red-600"><span className="font-medium">Razón:</span> {sheep.discarded_reason}</p>
            )}
          </div>
          
          <div className="text-xs text-gray-600 mt-2">
            <p>Edad: {age}</p>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(sheep);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar oveja"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(sheep.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar oveja"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


