import React from 'react';
import { InventoryProduct } from 'src/types/api';

interface InventoryProductCardProps {
  product: InventoryProduct;
  onView?: (product: InventoryProduct) => void;
}

export function InventoryProductCard({ product, onView }: InventoryProductCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      case 'SOLD':
        return 'bg-blue-100 text-blue-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'DISCARDED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'RESERVED':
        return 'Reservado';
      case 'SOLD':
        return 'Vendido';
      case 'EXPIRED':
        return 'Vencido';
      case 'DISCARDED':
        return 'Descartado';
      default:
        return status;
    }
  };

  const getProductTypeIcon = (type: string) => {
    switch (type) {
      case 'MEAT_RABBIT':
      case 'MEAT_CHICKEN':
      case 'MEAT_COW':
      case 'MEAT_SHEEP':
        return '🥩';
      case 'EGGS':
        return '🥚';
      case 'MILK':
      case 'CHEESE':
      case 'BUTTER':
        return '🥛';
      case 'WOOL':
        return '🧶';
      case 'HONEY':
        return '🍯';
      case 'WAX':
        return '🕯️';
      default:
        return '📦';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === 'UNITS' || unit === 'DOZENS') {
      return `${Math.floor(quantity)} ${unit === 'DOZENS' ? 'docenas' : 'unidades'}`;
    }
    return `${quantity.toFixed(2)} ${unit}`;
  };

  return (
    <div
      onClick={() => onView?.(product)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getProductTypeIcon(product.product_type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{product.product_name}</h3>
            <p className="text-xs text-gray-500">{product.product_type.replace('_', ' ')}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
          {getStatusLabel(product.status)}
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Cantidad:</span>
          <span className="font-medium text-gray-900">{formatQuantity(product.quantity, product.unit)}</span>
        </div>
        
        {product.unit_price && (
          <div className="flex justify-between">
            <span className="text-gray-600">Precio:</span>
            <span className="font-medium text-gray-900">
              ${product.unit_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}

        {product.location && (
          <div className="flex justify-between">
            <span className="text-gray-600">Ubicación:</span>
            <span className="font-medium text-gray-900">{product.location}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">Producción:</span>
          <span className="text-gray-900">{formatDate(product.production_date)}</span>
        </div>

        {product.expiration_date && (
          <div className="flex justify-between">
            <span className="text-gray-600">Vence:</span>
            <span className={`font-medium ${
              new Date(product.expiration_date) < new Date() 
                ? 'text-red-600' 
                : 'text-gray-900'
            }`}>
              {formatDate(product.expiration_date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

