import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useSellAnimal } from 'src/hooks/useAnimals';
import { Rabbit } from 'src/types/api';
import { ANIMAL_SPECIES } from 'src/constants/animals';

const SPECIES = ANIMAL_SPECIES.RABBIT;

interface RabbitSaleModalProps {
  rabbit: Rabbit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentUserId?: string;
}

export function RabbitSaleModal({ 
  rabbit, 
  isOpen, 
  onClose, 
  onSuccess,
  currentUserId
}: RabbitSaleModalProps) {
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const sellMutation = useSellAnimal(SPECIES);

  if (!rabbit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!price || parseFloat(price) <= 0) {
      setError('El precio es requerido y debe ser mayor a 0');
      return;
    }

    if (!currentUserId) {
      setError('Usuario no identificado. Por favor, inicia sesión.');
      return;
    }

    try {
      const saleData = {
        price: parseFloat(price),
        weight: weight ? parseInt(weight, 10) : undefined,
        height: height ? parseFloat(height) : undefined,
        notes: notes.trim() || undefined,
        sold_by: currentUserId,
        reason: 'Vendido'
      };

      await sellMutation.mutateAsync({ 
        id: rabbit.id, 
        saleData
      });
      
      // Reset form
      setPrice('');
      setWeight('');
      setHeight('');
      setNotes('');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al vender el conejo');
    }
  };

  const handleClose = () => {
    setPrice('');
    setWeight('');
    setHeight('');
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Vender Conejo">
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>💰 Venta:</strong> Estás a punto de vender el conejo <strong>{rabbit.name}</strong>.
            Se creará un registro de venta con la información proporcionada.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Precio de Venta <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={sellMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Peso (gramos)
            </label>
            <input
              id="weight"
              type="number"
              step="1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Peso al momento de la venta en gramos"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={sellMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
              Altura (cm)
            </label>
            <input
              id="height"
              type="number"
              step="0.01"
              min="0"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Altura al momento de la venta"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={sellMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas adicionales sobre la venta..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={sellMutation.isPending}
            />
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
              disabled={sellMutation.isPending}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sellMutation.isPending || !price || parseFloat(price) <= 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {sellMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>💰</span>
                  <span>Vender</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

