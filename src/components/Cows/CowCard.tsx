import React from 'react';
import { Cow } from 'src/types/api';
import { useAnimalAge } from 'src/hooks/useAnimalAge';
import { ANIMAL_SPECIES } from 'src/constants/animals';

interface CowCardProps {
  cow: Cow;
  onEdit?: (cow: Cow) => void;
  onDelete?: (cowId: string) => void;
  onView?: (cow: Cow) => void;
}

export function CowCard({ cow, onEdit, onDelete, onView }: CowCardProps) {
  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return '♂️';
      case 'FEMALE':
        return '♀️';
      default:
        return '🐄';
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

  const age = useAnimalAge(cow?.birth_date, ANIMAL_SPECIES.COW);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView?.(cow)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{cow.name}</h3>
            <span className="text-lg flex-shrink-0">{getGenderIcon(cow.gender)}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            {cow.gender && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getGenderColor(cow.gender)}`}>
                {cow.gender}
              </span>
            )}
            {cow.discarded && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Descartado
              </span>
            )}
          </div>
          
          {cow.image && (
            <div className="mb-2">
              <img 
                src={cow.image} 
                alt={cow.name}
                className="w-12 h-12 object-cover rounded"
              />
            </div>
          )}
          
          <div className="space-y-0.5 text-xs text-gray-600">
            <p><span className="font-medium">Nacimiento:</span> {formatDate(cow.birth_date)}</p>
            {cow.user_id && (
              <p><span className="font-medium">Propietario:</span> {cow.user_id}</p>
            )}
            {cow.discarded && cow.discarded_reason && (
              <p className="text-red-600"><span className="font-medium">Razón:</span> {cow.discarded_reason}</p>
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
                onEdit(cow);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar vaca"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cow.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Eliminar vaca"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


