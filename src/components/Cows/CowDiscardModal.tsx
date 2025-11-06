import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useDiscardCow } from 'src/hooks/useCows';
import { Cow } from 'src/types/api';

interface CowDiscardModalProps {
  cow: Cow | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CowDiscardModal({ 
  cow, 
  isOpen, 
  onClose, 
  onSuccess 
}: CowDiscardModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const discardMutation = useDiscardCow();

  if (!cow) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('La razón del descarte es requerida');
      return;
    }

    try {
      await discardMutation.mutateAsync({ 
        id: cow.id, 
        reason: reason.trim() 
      });
      setReason('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al descartar la vaca');
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Descartar Vaca">
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Atención:</strong> Estás a punto de marcar la vaca <strong>{cow.name}</strong> como descartada.
            Esta acción puede indicar que el animal fue vendido, sacrificado o eliminado por otra razón.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Razón del descarte <span className="text-red-500">*</span>
            </label>
            <input
              id="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Vendido, Sacrificado, Muerto, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={discardMutation.isPending}
            />
            <p className="mt-1 text-xs text-gray-500">
              Proporciona una razón clara para el descarte del animal
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={discardMutation.isPending}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={discardMutation.isPending || !reason.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {discardMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  <span>Descartar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

