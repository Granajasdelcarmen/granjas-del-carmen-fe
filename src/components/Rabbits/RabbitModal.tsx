import React, { useState, useEffect } from 'react';
import { Rabbit, DeadOffspring } from 'src/types/api';
import { Modal } from 'src/components/Common/Modal';
import { RabbitDiscardModal } from './RabbitDiscardModal';
import { RabbitSaleModal } from './RabbitSaleModal';
import { useAuth } from 'src/hooks/useAuth';
import { AgeDisplay } from 'src/components/Common/AgeDisplay';
import { rabbitSpecificService } from 'src/services/rabbitSpecificService';
import { logger } from 'src/utils/logger';
import { useUpdateAnimal, useSlaughterRabbit } from 'src/hooks/useAnimals';
import { ANIMAL_SPECIES } from 'src/constants/animals';

interface RabbitModalProps {
  rabbit: Rabbit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (rabbit: Rabbit) => void;
  onDelete?: (rabbitId: string) => void;
  onDiscard?: () => void;
  onSell?: () => void;
  currentUserId?: string;
}

export function RabbitModal({ rabbit, isOpen, onClose, onEdit, onDelete, onDiscard, onSell, currentUserId }: RabbitModalProps) {
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isSlaughterConfirmOpen, setIsSlaughterConfirmOpen] = useState(false);
  const [deadOffspring, setDeadOffspring] = useState<DeadOffspring[]>([]);
  const [isLoadingDeadOffspring, setIsLoadingDeadOffspring] = useState(false);
  const [isUpdatingBreeder, setIsUpdatingBreeder] = useState(false);
  const { canSellOrDiscard } = useAuth();
  const updateAnimal = useUpdateAnimal(ANIMAL_SPECIES.RABBIT);
  const slaughterMutation = useSlaughterRabbit();

  // Load dead offspring if rabbit is a female
  useEffect(() => {
    if (isOpen && rabbit && rabbit.gender === 'FEMALE' && !rabbit.discarded) {
      setIsLoadingDeadOffspring(true);
      rabbitSpecificService.getDeadOffspringByMother(rabbit.id)
        .then(data => {
          setDeadOffspring(data);
          setIsLoadingDeadOffspring(false);
        })
        .catch(error => {
          logger.error('Error loading dead offspring', error);
          setIsLoadingDeadOffspring(false);
        });
    } else {
      setDeadOffspring([]);
    }
  }, [isOpen, rabbit?.id, rabbit?.gender]);

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

  const handleSlaughter = async () => {
    try {
      await slaughterMutation.mutateAsync(rabbit.id);
      setIsSlaughterConfirmOpen(false);
      onClose();
    } catch (error) {
      logger.error('Error al sacrificar conejo', error);
      alert('Error al sacrificar el conejo');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles del Conejo: ${rabbit.name}`}>
      <div className="space-y-6">
        {/* Header con información principal */}
        <div className="flex items-start space-x-6 pb-4 border-b border-gray-200">
          {/* Imagen */}
          <div className="flex-shrink-0">
            {rabbit.image ? (
              <img 
                src={rabbit.image} 
                alt={rabbit.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-5xl">{getGenderIcon(rabbit.gender)}</span>
              </div>
            )}
          </div>
          
          {/* Información principal - más prominente */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-2xl font-bold text-gray-900">{rabbit.name}</h2>
              <span className="text-3xl">{getGenderIcon(rabbit.gender)}</span>
            </div>
            
            {/* Badges de estado - tamaño medio */}
            <div className="flex flex-wrap gap-2 mb-3">
              {rabbit.gender && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(rabbit.gender)}`}>
                  {rabbit.gender}
                </span>
              )}
              {rabbit.is_breeder && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Reproductor
                </span>
              )}
              {!rabbit.is_breeder && !rabbit.discarded && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Venta
                </span>
              )}
              {rabbit.discarded && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Descartado
                </span>
              )}
              {rabbit.slaughtered && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  🥩 Sacrificado
                </span>
              )}
              {rabbit.in_freezer && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  ❄️ En Congelador
                </span>
              )}
            </div>

            {/* Información crítica - tamaño medio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha de Nacimiento</p>
                <p className="text-base font-medium text-gray-900">{formatDate(rabbit.birth_date)}</p>
                <AgeDisplay birthDate={rabbit.birth_date} animalType="RABBIT" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Origen</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                  rabbit.origin === 'BORN' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {rabbit.origin === 'BORN' ? 'Nacido en la granja' : 'Comprado'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información detallada - organizada por importancia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Información operativa */}
          <div className="space-y-4">
            {/* Estado de Reproductor - Importante */}
            {!rabbit.discarded && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Estado de Reproductor</h3>
                <div className="flex items-center space-x-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rabbit.is_breeder || false}
                      onChange={async (e) => {
                        if (isUpdatingBreeder) return;
                        setIsUpdatingBreeder(true);
                        try {
                          await updateAnimal.mutateAsync({
                            id: rabbit.id,
                            animalData: { is_breeder: e.target.checked }
                          });
                        } catch (error) {
                          logger.error('Error al actualizar estado de reproductor', error);
                          alert('Error al actualizar el estado de reproductor');
                        } finally {
                          setIsUpdatingBreeder(false);
                        }
                      }}
                      disabled={isUpdatingBreeder || updateAnimal.isPending}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {rabbit.is_breeder ? '⭐ Reproductor (Permanencia)' : 'Venta (No reproductor)'}
                    </span>
                  </label>
                  {(isUpdatingBreeder || updateAnimal.isPending) && (
                    <span className="text-xs text-gray-500">Guardando...</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {rabbit.is_breeder 
                    ? 'Este conejo está marcado como reproductor y se mantendrá en la granja para reproducción.'
                    : 'Este conejo está destinado para venta y no se usará para reproducción.'}
                </p>
              </div>
            )}

            {/* Estado de Sacrificio - Importante si está sacrificado */}
            {rabbit.slaughtered && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-orange-900 mb-2">🥩 Estado de Sacrificio</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-orange-800">
                    <span className="font-medium">Sacrificado:</span> {rabbit.slaughtered_date ? formatDate(rabbit.slaughtered_date) : 'Fecha no disponible'}
                  </p>
                  {rabbit.in_freezer && (
                    <p className="text-blue-800">
                      <span className="font-medium">❄️ Estado:</span> En Congelador (disponible para venta)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Información de compra - Secundaria */}
            {rabbit.origin === 'PURCHASED' && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Información de Compra</h3>
                <div className="space-y-2 text-sm">
                  {rabbit.purchase_date && (
                    <div>
                      <p className="text-xs text-gray-500">Fecha de Compra</p>
                      <p className="text-gray-900 font-medium">{formatDate(rabbit.purchase_date)}</p>
                    </div>
                  )}
                  {rabbit.purchase_price && (
                    <div>
                      <p className="text-xs text-gray-500">Precio de Compra</p>
                      <p className="text-gray-900 font-medium">${rabbit.purchase_price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  )}
                  {rabbit.purchase_vendor && (
                    <div>
                      <p className="text-xs text-gray-500">Vendedor/Proveedor</p>
                      <p className="text-gray-900 font-medium">{rabbit.purchase_vendor}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Información de padres - Secundaria */}
            {rabbit.origin === 'BORN' && (rabbit.mother || rabbit.father) && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Padres</h3>
                <div className="space-y-1 text-sm">
                  {rabbit.mother && (
                    <p className="text-gray-900">
                      <span className="font-medium">Madre:</span> {rabbit.mother.name}
                    </p>
                  )}
                  {rabbit.father && (
                    <p className="text-gray-900">
                      <span className="font-medium">Padre:</span> {rabbit.father.name}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Razón de descarte - Si está descartado */}
            {rabbit.discarded && rabbit.discarded_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-red-900 mb-1">Razón de Descarte</h3>
                <p className="text-sm text-red-800">{rabbit.discarded_reason}</p>
              </div>
            )}
          </div>
          
          {/* Columna derecha - Información de descendencia */}
          <div className="space-y-4">
            {/* Información de hijos - Importante */}
            {rabbit.children && rabbit.children.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Hijos Vivos ({rabbit.children.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {rabbit.children.map(child => (
                    <div key={child.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
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

            {/* Información de crías muertas - Importante para hembras */}
            {rabbit.gender === 'FEMALE' && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Crías Muertas {isLoadingDeadOffspring ? '(Cargando...)' : `(${deadOffspring.reduce((sum, record) => sum + record.count, 0)})`}
                </h3>
                {isLoadingDeadOffspring ? (
                  <p className="text-sm text-gray-500">Cargando...</p>
                ) : deadOffspring.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {deadOffspring.map(record => (
                      <div key={record.id} className="p-2 bg-white border border-red-200 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-red-900">
                            {record.count} cría{record.count > 1 ? 's' : ''} muerta{record.count > 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-red-600">{formatDate(record.birth_date)}</p>
                        </div>
                        {record.suspected_cause && (
                          <p className="text-xs text-red-700 mb-1">
                            <span className="font-medium">Causa:</span> {record.suspected_cause}
                          </p>
                        )}
                        {record.notes && (
                          <p className="text-xs text-red-600">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No hay registros de crías muertas</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Información terciaria - Fechas de sistema (pequeñas y grises) */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              Creado: {new Date(rabbit.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            <span>
              Actualizado: {new Date(rabbit.updated_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Acciones */}
        {(onEdit || onDelete || !rabbit.discarded || rabbit.in_freezer) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {/* Botón de Sacrificar - Solo si no está descartado ni ya sacrificado */}
            {!rabbit.discarded && !rabbit.slaughtered && canSellOrDiscard && (
              <button
                onClick={() => setIsSlaughterConfirmOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <span>🥩</span>
                <span>Sacrificar</span>
              </button>
            )}
            
            {/* Permitir vender si está activo o si está en congelador */}
            {(!rabbit.discarded || rabbit.in_freezer) && canSellOrDiscard && (
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <span>💰</span>
                <span>{rabbit.in_freezer ? 'Vender desde Congelador' : 'Vender'}</span>
              </button>
            )}
            
            {/* Botón de descartar - Solo si no está descartado */}
            {!rabbit.discarded && canSellOrDiscard && (
              <button
                onClick={() => setIsDiscardModalOpen(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <span>🗑️</span>
                <span>Descartar</span>
              </button>
            )}
            
            {onEdit && !rabbit.discarded && (
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

      {/* Modal de confirmación de sacrificio */}
      {isSlaughterConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Sacrificio</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas sacrificar el conejo <strong>{rabbit.name}</strong>? 
              El conejo será marcado como sacrificado y almacenado en el congelador, disponible para venta posterior.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsSlaughterConfirmOpen(false)}
                disabled={slaughterMutation.isPending}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSlaughter}
                disabled={slaughterMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {slaughterMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <span>🥩</span>
                    <span>Confirmar Sacrificio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de venta */}
      <RabbitSaleModal
        rabbit={rabbit}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onSuccess={() => {
          onSell?.();
          onClose();
        }}
        currentUserId={currentUserId}
      />

      {/* Modal de descarte */}
      <RabbitDiscardModal
        rabbit={rabbit}
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
