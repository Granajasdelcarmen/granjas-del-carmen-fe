import React, { useState } from 'react';
import { Sheep } from 'src/types/api';
import { Modal } from 'src/components/Common/Modal';
import { SheepDiscardModal } from './SheepDiscardModal';
import { SheepSaleModal } from './SheepSaleModal';
import { useAuth } from 'src/hooks/useAuth';
import { AgeDisplay } from 'src/components/Common/AgeDisplay';

interface SheepModalProps {
  sheep: Sheep | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (sheep: Sheep) => void;
  onDelete?: (sheepId: string) => void;
  onDiscard?: () => void;
  onSell?: () => void;
  currentUserId?: string;
}

export function SheepModal({ sheep, isOpen, onClose, onEdit, onDelete, onDiscard, onSell, currentUserId }: SheepModalProps) {
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const { canSellOrDiscard } = useAuth();
  if (!sheep) return null;

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
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles de la Oveja: ${sheep.name}`}>
      <div className="space-y-6">
        {/* Header con imagen */}
        <div className="flex items-start space-x-6">
          {/* Imagen - 50% del espacio */}
          <div className="w-1/2 flex flex-col items-center">
            {sheep.image ? (
              <img 
                src={sheep.image} 
                alt={sheep.name}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-5xl">{getGenderIcon(sheep.gender)}</span>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center">{sheep.name}</p>
          </div>
          
          {/* Información - 50% del espacio */}
          <div className="w-1/2">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-xl font-bold text-gray-900">{sheep.name}</h2>
              <span className="text-2xl">{getGenderIcon(sheep.gender)}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {sheep.gender && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(sheep.gender)}`}>
                  {sheep.gender}
                </span>
              )}
              {sheep.discarded && (
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">Origen</h3>
              <p className="text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sheep.origin === 'BORN' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {sheep.origin === 'BORN' ? 'Nacido en la granja' : 'Comprado'}
                </span>
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Nacimiento</h3>
              <p className="text-gray-900">{formatDate(sheep.birth_date)}</p>
            </div>
            <div>
              <AgeDisplay birthDate={sheep.birth_date} animalType="SHEEP" />
            </div>
            
            {/* Información de compra */}
            {sheep.origin === 'PURCHASED' && (
              <>
                {sheep.purchase_date && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Compra</h3>
                    <p className="text-gray-900">{formatDate(sheep.purchase_date)}</p>
                  </div>
                )}
                {sheep.purchase_price && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Precio de Compra</h3>
                    <p className="text-gray-900">${sheep.purchase_price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  </div>
                )}
                {sheep.purchase_vendor && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Vendedor/Proveedor</h3>
                    <p className="text-gray-900">{sheep.purchase_vendor}</p>
                  </div>
                )}
              </>
            )}
            
            {/* Información de padres */}
            {sheep.origin === 'BORN' && (sheep.mother || sheep.father) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Padres</h3>
                <div className="space-y-1">
                  {sheep.mother && (
                    <p className="text-gray-900 text-sm">
                      <span className="font-medium">Madre:</span> {sheep.mother.name}
                    </p>
                  )}
                  {sheep.father && (
                    <p className="text-gray-900 text-sm">
                      <span className="font-medium">Padre:</span> {sheep.father.name}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {sheep.user_id && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Propietario ID</h3>
                <p className="text-gray-900 font-mono text-sm">{sheep.user_id}</p>
              </div>
            )}
            
            {sheep.discarded && sheep.discarded_reason && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Razón de Descarte</h3>
                <p className="text-red-600">{sheep.discarded_reason}</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Información de hijos */}
            {sheep.children && sheep.children.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Hijos ({sheep.children.length})</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {sheep.children.map(child => (
                    <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{child.name}</p>
                        <p className="text-xs text-gray-500">
                          {child.gender} • {formatDate(child.birth_date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h3>
              <p className="text-gray-900">{new Date(sheep.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
              <p className="text-gray-900">{new Date(sheep.updated_at).toLocaleDateString('es-ES', {
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
        {(onEdit || onDelete || !sheep.discarded) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {!sheep.discarded && canSellOrDiscard && (
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
            {onEdit && !sheep.discarded && (
              <button
                onClick={() => {
                  onEdit(sheep);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Editar Oveja
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(sheep.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Oveja
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal de venta */}
      <SheepSaleModal
        sheep={sheep}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSuccess={() => {
          onSell?.();
          onClose();
        }}
        currentUserId={currentUserId}
      />

      {/* Modal de descarte */}
      <SheepDiscardModal
        sheep={sheep}
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


