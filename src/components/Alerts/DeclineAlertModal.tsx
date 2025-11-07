import React, { useState } from 'react';

interface DeclineAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  alertName: string;
  isLoading?: boolean;
}

export function DeclineAlertModal({
  isOpen,
  onClose,
  onConfirm,
  alertName,
  isLoading = false,
}: DeclineAlertModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('La razón es requerida');
      return;
    }
    
    if (reason.trim().length < 10) {
      setError('La razón debe tener al menos 10 caracteres');
      return;
    }
    
    setError('');
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          ¿Declinar alerta?
        </h2>
        
        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas declinar la alerta:
        </p>
        
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-4">
          <p className="font-medium text-gray-900">{alertName}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Razón de declinación <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explica por qué no se llevará a cabo esta tarea..."
              disabled={isLoading}
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Mínimo 10 caracteres
            </p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Declinando...</span>
                </>
              ) : (
                <>
                  <span>✗</span>
                  <span>Declinar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

