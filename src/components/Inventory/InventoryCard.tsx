import React from 'react';
import { Inventory } from 'src/types/api';

interface InventoryCardProps {
  item: Inventory;
  onEdit?: (item: Inventory) => void;
  onDelete?: (itemId: string) => void;
}

export function InventoryCard({ item, onEdit, onDelete }: InventoryCardProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{item.item}</h3>
            <span className="text-2xl">{getQuantityIcon(item.quantity)}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQuantityColor(item.quantity)}`}>
              {item.quantity} unidades
            </span>
          </div>
          
          <div className="text-xs text-gray-400 mt-3">
            <p>Creado: {new Date(item.created_at).toLocaleDateString()}</p>
            <p>Actualizado: {new Date(item.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar item"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar item"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
