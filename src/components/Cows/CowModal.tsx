import React, { useState } from 'react';
import { Cow } from 'src/types/api';
import { Modal } from 'src/components/Common/Modal';
import { CowDiscardModal } from './CowDiscardModal';
import { CowSaleModal } from './CowSaleModal';
import { useAuth } from 'src/hooks/useAuth';
import { AgeDisplay } from 'src/components/Common/AgeDisplay';

interface CowModalProps {
  cow: Cow | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (cow: Cow) => void;
  onDelete?: (cowId: string) => void;
  onDiscard?: () => void;
  onSell?: () => void;
  currentUserId?: string;
}

export function CowModal({ cow, isOpen, onClose, onEdit, onDelete, onDiscard, onSell, currentUserId }: CowModalProps) {
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const { canSellOrDiscard } = useAuth();
  if (!cow) return null;

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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles de la Vaca: ${cow.name}`}>
      <div className="space-y-6">
        {/* Header con imagen */}
        <div className="flex items-start space-x-6">
          {/* Imagen - 50% del espacio */}
          <div className="w-1/2 flex flex-col items-center">
            {cow.image ? (
              <img 
                src={cow.image} 
                alt={cow.name}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-5xl">{getGenderIcon(cow.gender)}</span>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">{cow.name}</p>
          </div>
          
          {/* Información - 50% del espacio */}
          <div className="w-1/2">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-xl font-bold text-gray-900">{cow.name}</h2>
              <span className="text-2xl">{getGenderIcon(cow.gender)}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {cow.gender && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(cow.gender)}`}>
                  {cow.gender}
                </span>
              )}
              {cow.discarded && (
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
              <p className="text-gray-900">{formatDate(cow.birth_date)}</p>
            </div>
            <div>
              <AgeDisplay birthDate={cow.birth_date} animalType="COW" />
            </div>
            
            {cow.user_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Propietario ID</h3>
                <p className="text-gray-900 font-mono text-sm">{cow.user_id}</p>
              </div>
            )}
            
            {cow.discarded && cow.discarded_reason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Razón de Descarte</h3>
                <p className="text-red-600">{cow.discarded_reason}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h3>
              <p className="text-gray-900">{new Date(cow.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
              <p className="text-gray-900">{new Date(cow.updated_at).toLocaleDateString('es-ES', {
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
        {(onEdit || onDelete || !cow.discarded) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {!cow.discarded && canSellOrDiscard && (
              <>
                <button
                  onClick={() => setIsSaleModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <span>💰</span>
                  <span>Vender</span>
                </button>
                <button
                  onClick={() => setIsDiscardModalOpen(true)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                >
                  <span>🗑️</span>
                  <span>Descartar</span>
                </button>
              </>
            )}
            {onEdit && !cow.discarded && (
              <button
                onClick={() => {
                  onEdit(cow);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Editar Vaca
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(cow.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Vaca
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de venta */}
      <CowSaleModal
        cow={cow}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSuccess={() => {
          onSell?.();
          onClose();
        }}
        currentUserId={currentUserId}
      />

      {/* Modal de descarte */}
      <CowDiscardModal
        cow={cow}
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onSuccess={() => {
          onDiscard?.();
          onClose();
        }}
      />
    </Modal>
  );
}


