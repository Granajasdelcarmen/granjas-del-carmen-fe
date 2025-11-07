import React, { useState, useEffect } from 'react';
import { AlertRabbit } from 'src/types/api';
import { alertService } from 'src/services/alertService';

interface SlaughterRabbitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedRabbitIds: string[]) => void;
  alertId: number;
  isLoading?: boolean;
}

export function SlaughterRabbitsModal({
  isOpen,
  onClose,
  onConfirm,
  alertId,
  isLoading = false,
}: SlaughterRabbitsModalProps) {
  const [rabbits, setRabbits] = useState<AlertRabbit[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingRabbits, setLoadingRabbits] = useState(false);

  useEffect(() => {
    if (isOpen && alertId) {
      loadRabbits();
    } else {
      setRabbits([]);
      setSelectedIds(new Set());
    }
  }, [isOpen, alertId]);

  const loadRabbits = async () => {
    setLoadingRabbits(true);
    try {
      const rabbitsData = await alertService.getAlertRabbits(alertId);
      setRabbits(rabbitsData);
      // Por defecto, seleccionar todos los que no estén ya sacrificados
      const notSlaughtered = rabbitsData
        .filter(r => !r.slaughtered)
        .map(r => r.id);
      setSelectedIds(new Set(notSlaughtered));
    } catch (error) {
      console.error('Error loading rabbits:', error);
    } finally {
      setLoadingRabbits(false);
    }
  };

  const toggleRabbit = (rabbitId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(rabbitId)) {
      newSelected.delete(rabbitId);
    } else {
      newSelected.add(rabbitId);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    if (selectedIds.size === 0) {
      alert('Debes seleccionar al menos un conejo para sacrificar');
      return;
    }
    onConfirm(Array.from(selectedIds));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Seleccionar conejos sacrificados
        </h2>
        
        <p className="text-gray-600 mb-4">
          Selecciona los conejos que fueron sacrificados. Los conejos seleccionados se marcarán como sacrificados y se almacenarán en el congelador.
        </p>

        {loadingRabbits ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-spin text-2xl">⏳</span>
            <span className="ml-2 text-gray-600">Cargando conejos...</span>
          </div>
        ) : rabbits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron conejos para esta alerta
          </div>
        ) : (
          <>
            <div className="border border-gray-200 rounded-lg mb-4 max-h-96 overflow-y-auto">
              {rabbits.map((rabbit) => {
                const isSelected = selectedIds.has(rabbit.id);
                const isAlreadySlaughtered = rabbit.slaughtered;
                
                return (
                  <div
                    key={rabbit.id}
                    className={`p-3 border-b border-gray-100 last:border-b-0 ${
                      isAlreadySlaughtered ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                    } ${isSelected && !isAlreadySlaughtered ? 'bg-green-50' : ''}`}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => !isAlreadySlaughtered && toggleRabbit(rabbit.id)}
                        disabled={isAlreadySlaughtered || isLoading}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isAlreadySlaughtered ? 'text-gray-400' : 'text-gray-900'}`}>
                            {rabbit.name}
                          </span>
                          {isAlreadySlaughtered && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Ya sacrificado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {rabbit.gender && (
                            <span>{rabbit.gender === 'MALE' ? 'Macho' : 'Hembra'}</span>
                          )}
                          {rabbit.birth_date && (
                            <span className="ml-2">
                              • Nacido: {new Date(rabbit.birth_date).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>{selectedIds.size}</strong> de <strong>{rabbits.filter(r => !r.slaughtered).length}</strong> conejos seleccionados para sacrificar
              </p>
            </div>
          </>
        )}
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || selectedIds.size === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Completando...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Completar ({selectedIds.size})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

