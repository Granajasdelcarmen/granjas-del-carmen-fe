import React, { useState } from 'react';
import { Inventory } from 'src/types/api';
import { Modal } from 'src/components/Common/Modal';
import { useAddItemQuantity, useSubtractItemQuantity, useUpdateItemQuantity } from 'src/hooks/useInventory';

interface InventoryModalProps {
  item: Inventory | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (item: Inventory) => void;
  onDelete?: (itemId: string) => void;
}

export function InventoryModal({ item, isOpen, onClose, onEdit, onDelete }: InventoryModalProps) {
  const addQty = useAddItemQuantity();
  const subQty = useSubtractItemQuantity();
  const setQty = useUpdateItemQuantity();
  const [amount, setAmount] = useState<number | ''>('');
  const [exact, setExact] = useState<number | ''>('');
  if (!item) return null;

  const getQuantityColor = (quantity: number) => {
    if (quantity === 0) return 'bg-red-100 text-red-800';
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getQuantityIcon = (quantity: number) => {
    if (quantity === 0) return '❌';
    if (quantity < 10) return '⚠️';
    return '✅';
  };

  const getQuantityStatus = (quantity: number) => {
    if (quantity === 0) return 'Sin stock';
    if (quantity < 10) return 'Stock bajo';
    return 'Stock normal';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalles del Item: ${item.item}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start space-x-6">
          {/* Icono - 50% del espacio */}
          <div className="w-1/2 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <span className="text-5xl">{getQuantityIcon(item.quantity)}</span>
            </div>
            <p className="text-sm text-gray-500 text-center">{item.item}</p>
          </div>
          
          {/* Información - 50% del espacio */}
          <div className="w-1/2">
            <h2 className="text-xl font-bold text-gray-900 mb-3">{item.item}</h2>
            
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQuantityColor(item.quantity)}`}>
                {item.quantity} unidades
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQuantityColor(item.quantity)}`}>
                {getQuantityStatus(item.quantity)}
              </span>
            </div>
          </div>
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Cantidad Actual</h3>
              <p className="text-2xl font-bold text-gray-900">{item.quantity}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado del Stock</h3>
              <p className={`text-sm font-medium ${getQuantityColor(item.quantity).split(' ')[1]}`}>
                {getQuantityStatus(item.quantity)}
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</h3>
              <p className="text-gray-900">
                {item.created_at 
                  ? new Date(item.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No especificada'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Última Actualización</h3>
              <p className="text-gray-900">
                {item.updated_at 
                  ? new Date(item.updated_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'No especificada'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {(onEdit || onDelete) && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(item);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Editar Item
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(item.id);
                  onClose();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Eliminar Item
              </button>
            )}
          </div>
        )}

        {/* Operaciones de cantidad */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Actualizar cantidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-24 border border-gray-300 rounded px-2 py-1"
                placeholder="+/-"
              />
              <button
                disabled={amount === '' || addQty.isPending}
                onClick={() => addQty.mutate({ id: item.id, amount: Number(amount) }, { onSuccess: () => setAmount('') })}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                + Agregar
              </button>
              <button
                disabled={amount === '' || subQty.isPending}
                onClick={() => subQty.mutate({ id: item.id, amount: Number(amount) }, { onSuccess: () => setAmount('') })}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                - Restar
              </button>
            </div>
            <div className="flex items-center space-x-2 md:col-span-2">
              <input
                type="number"
                min={0}
                value={exact}
                onChange={(e) => setExact(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-24 border border-gray-300 rounded px-2 py-1"
                placeholder="exacto"
              />
              <button
                disabled={exact === '' || setQty.isPending}
                onClick={() => setQty.mutate({ id: item.id, quantity: Number(exact) }, { onSuccess: () => setExact('') })}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Establecer
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
