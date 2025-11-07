import React from 'react';
import { Inventory } from 'src/types/api';

interface InventoryCardProps {
  item: Inventory;
  onEdit?: (item: Inventory) => void;
  onDelete?: (itemId: string) => void;
  onView?: (item: Inventory) => void;
}

export function InventoryCard({ item, onEdit, onDelete, onView }: InventoryCardProps) {
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
    <div 
      className="bg-white rounded-lg shadow-sm border p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView?.(item)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{item.item}</h3>
            <span className="text-lg flex-shrink-0">{getQuantityIcon(item.quantity)}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getQuantityColor(item.quantity)}`}>
              {item.quantity} unidades
            </span>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>Creado: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'No especificado'}</p>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2 flex-shrink-0">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Editar item"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
