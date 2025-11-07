import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateInventoryItem } from 'src/hooks/useInventory';

interface InventoryCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryCreateModal({ isOpen, onClose }: InventoryCreateModalProps) {
  const createItem = useCreateInventoryItem();
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');

  const canSubmit = item.trim().length > 0 && quantity !== '' && Number(quantity) >= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    createItem.mutate(
      { item, quantity: Number(quantity) },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Item de Inventario">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del item"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <input
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || createItem.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {createItem.isPending ? 'Guardando...' : 'Crear' }
          </button>
        </div>
      </form>
    </Modal>
  );
}


