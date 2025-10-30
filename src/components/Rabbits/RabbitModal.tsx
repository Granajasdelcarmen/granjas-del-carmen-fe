import React from 'react';
import { Rabbit } from 'src/types/api';
import { Modal } from 'src/components/Common/Modal';

interface RabbitModalProps {
  rabbit: Rabbit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (rabbit: Rabbit) => void;
  onDelete?: (rabbitId: string) => void;
}

export function RabbitModal({ rabbit, isOpen, onClose, onEdit, onDelete }: RabbitModalProps) {
  if (!rabbit) return null;

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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles del Conejo: ${rabbit.name}`}>
      <div className="space-y-6">
        {/* Header con imagen */}
        <div className="flex items-start space-x-6">
          {/* Imagen - 50% del espacio */}
          <div className="w-1/2 flex flex-col items-center">
            {rabbit.image ? (
              <img 
                src={rabbit.image} 
                alt={rabbit.name}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-5xl">{getGenderIcon(rabbit.gender)}</span>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">{rabbit.name}</p>
          </div>
          
          {/* Información - 50% del espacio */}
          <div className="w-1/2">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-xl font-bold text-gray-900">{rabbit.name}</h2>
              <span className="text-2xl">{getGenderIcon(rabbit.gender)}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {rabbit.gender && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(rabbit.gender)}`}>
                  {rabbit.gender}
                </span>
              )}
              {rabbit.discarded && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Descartado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</h3>
              <p className="text-gray-900">{formatDate(rabbit.birth_date)}</p>
            </div>
            
            {rabbit.user_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Propietario ID</h3>
                <p className="text-gray-900 font-mono text-sm">{rabbit.user_id}</p>
              </div>
            )}
            
            {rabbit.discarded && rabbit.discarded_reason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Razón de Descarte</h3>
                <p className="text-red-600">{rabbit.discarded_reason}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h3>
              <p className="text-gray-900">{new Date(rabbit.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
              <p className="text-gray-900">{new Date(rabbit.updated_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(rabbit);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Editar Conejo
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(rabbit.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Conejo
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
