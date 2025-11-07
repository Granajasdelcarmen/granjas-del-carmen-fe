import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { InventoryProduct } from 'src/types/api';
import { useSellInventoryProduct, useProductTransactions } from 'src/hooks/useInventoryProducts';

interface InventoryProductModalProps {
  product: InventoryProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryProductModal({ product, isOpen, onClose }: InventoryProductModalProps) {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState('');
  const sellMutation = useSellInventoryProduct();
  const { data: transactions } = useProductTransactions(product?.id || '');

  if (!product) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === 'UNITS' || unit === 'DOZENS') {
      return `${Math.floor(quantity)} ${unit === 'DOZENS' ? 'docenas' : 'unidades'}`;
    }
    return `${quantity.toFixed(2)} ${unit}`;
  };

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

  const handleSell = async () => {
    if (!sellQuantity || parseFloat(sellQuantity) <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (parseFloat(sellQuantity) > product.quantity) {
      alert('La cantidad a vender no puede ser mayor a la cantidad disponible');
      return;
    }

    try {
      await sellMutation.mutateAsync({
        id: product.id,
        saleData: { quantity: parseFloat(sellQuantity) }
      });
      setIsSellModalOpen(false);
      setSellQuantity('');
      onClose();
    } catch (error) {
      alert('Error al vender el producto');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Producto: ${product.product_name}`}>
        <div className="space-y-6">
          {/* Información principal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{product.product_name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                {getStatusLabel(product.status)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{product.product_type.replace('_', ' ')}</p>
          </div>

          {/* Información detallada */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Cantidad</p>
              <p className="text-base font-medium text-gray-900">{formatQuantity(product.quantity, product.unit)}</p>
            </div>
            {product.unit_price && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Precio Unitario</p>
                <p className="text-base font-medium text-gray-900">
                  ${product.unit_price.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
            {product.location && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Ubicación</p>
                <p className="text-base font-medium text-gray-900">{product.location}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Fecha de Producción</p>
              <p className="text-base font-medium text-gray-900">{formatDate(product.production_date)}</p>
            </div>
            {product.expiration_date && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Fecha de Vencimiento</p>
                <p className={`text-base font-medium ${
                  new Date(product.expiration_date) < new Date() ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {formatDate(product.expiration_date)}
                </p>
              </div>
            )}
          </div>

          {product.notes && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Notas</p>
              <p className="text-sm text-gray-900">{product.notes}</p>
            </div>
          )}

          {/* Transacciones */}
          {transactions && transactions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Historial de Transacciones</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{transaction.transaction_type}</span>
                      <span className={transaction.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                        {transaction.quantity > 0 ? '+' : ''}{formatQuantity(Math.abs(transaction.quantity), product.unit)}
                      </span>
                    </div>
                    {transaction.reason && (
                      <p className="text-xs text-gray-500">{transaction.reason}</p>
                    )}
                    <p className="text-xs text-gray-400">{formatDate(transaction.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información terciaria */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between text-xs text-gray-400">
              <span>
                Creado: {formatDate(product.created_at)}
              </span>
              <span>
                Actualizado: {formatDate(product.updated_at)}
              </span>
            </div>
          </div>

          {/* Acciones */}
          {product.status === 'AVAILABLE' && product.quantity > 0 && (
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <span>💰</span>
                <span>Vender</span>
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de venta */}
      {isSellModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vender Producto</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad a vender (máximo: {formatQuantity(product.quantity, product.unit)})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={product.quantity}
                  value={sellQuantity}
                  onChange={(e) => setSellQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsSellModalOpen(false);
                    setSellQuantity('');
                  }}
                  disabled={sellMutation.isPending}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSell}
                  disabled={sellMutation.isPending || !sellQuantity || parseFloat(sellQuantity) <= 0}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {sellMutation.isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Vendiendo...</span>
                    </>
                  ) : (
                    <span>Confirmar Venta</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

