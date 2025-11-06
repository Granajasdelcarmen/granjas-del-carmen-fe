import React, { useState, useEffect } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { ProductSale, ProductSaleCreate, ProductType } from 'src/types/api';

interface ProductSaleCreateModalProps {
  sale?: ProductSale | null;
  onClose: () => void;
  onSubmit: (saleData: ProductSaleCreate) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductSaleCreateModal({ sale, onClose, onSubmit, isSubmitting }: ProductSaleCreateModalProps) {
  const [productType, setProductType] = useState<ProductType>('miel');
  const [quantity, setQuantity] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [saleDate, setSaleDate] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (sale) {
      setProductType(sale.product_type);
      setQuantity(sale.quantity.toString());
      setUnitPrice(sale.unit_price.toString());
      setSaleDate(sale.sale_date.split('T')[0]);
      setCustomerName(sale.customer_name || '');
      setNotes(sale.notes || '');
    } else {
      // Default to today's date
      const today = new Date().toISOString().split('T')[0];
      setSaleDate(today);
    }
  }, [sale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData: ProductSaleCreate = {
      product_type: productType,
      quantity: parseFloat(quantity),
      unit_price: parseFloat(unitPrice),
      sale_date: new Date(saleDate).toISOString(),
      customer_name: customerName || undefined,
      notes: notes || undefined,
    };

    await onSubmit(saleData);
  };

  const canSubmit = quantity && unitPrice && saleDate && parseFloat(quantity) > 0 && parseFloat(unitPrice) > 0;

  return (
    <Modal isOpen={true} onClose={onClose} title={sale ? 'Editar Venta' : 'Nueva Venta de Producto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de Producto</label>
            <select
              required
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="miel">Miel</option>
              <option value="huevos">Huevos</option>
              <option value="leche">Leche</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de Venta</label>
            <input
              type="date"
              required
              value={saleDate}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Cantidad</label>
            <input
              type="number"
              step="0.01"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Precio por Unidad</label>
            <input
              type="number"
              step="0.01"
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="0.00"
            />
          </div>
        </div>

        {quantity && unitPrice && parseFloat(quantity) > 0 && parseFloat(unitPrice) > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Total:</span>{' '}
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(parseFloat(quantity) * parseFloat(unitPrice))}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cliente (opcional)</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            placeholder="Nombre del cliente"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notas adicionales sobre la venta"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
          >
            {isSubmitting ? 'Guardando...' : sale ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

