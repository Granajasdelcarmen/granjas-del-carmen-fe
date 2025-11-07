import React from 'react';

interface CompleteAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  alertName: string;
  isLoading?: boolean;
}

export function CompleteAlertModal({
  isOpen,
  onClose,
  onConfirm,
  alertName,
  isLoading = false,
}: CompleteAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ¿Completar alerta?
        </h2>
        
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas marcar como completada la alerta:
        </p>
        
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-6">
          <p className="font-medium text-gray-900">{alertName}</p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Completando...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Completar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

