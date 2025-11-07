import React, { useState } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { useCreateInventoryProduct } from 'src/hooks/useInventoryProducts';
import { InventoryProductCreate, InventoryProductType, InventoryUnit } from 'src/types/api';

interface InventoryProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InventoryProductCreateModal({ isOpen, onClose }: InventoryProductCreateModalProps) {
  const [productData, setProductData] = useState<InventoryProductCreate>({
    product_type: 'MEAT_RABBIT',
    product_name: '',
    quantity: 0,
    unit: 'UNITS',
  });
  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateInventoryProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productData.product_name.trim()) {
      setError('El nombre del producto es requerido');
      return;
    }

    if (productData.quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    try {
      await createMutation.mutateAsync(productData);
      // Reset form
      setProductData({
        product_type: 'MEAT_RABBIT',
        product_name: '',
        quantity: 0,
        unit: 'UNITS',
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al crear el producto');
    }
  };

  const handleClose = () => {
    setProductData({
      product_type: 'MEAT_RABBIT',
      product_name: '',
      quantity: 0,
      unit: 'UNITS',
    });
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Producto de Inventario">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Producto <span className="text-red-500">*</span>
          </label>
          <select
            id="product_type"
            value={productData.product_type}
            onChange={(e) => setProductData({ ...productData, product_type: e.target.value as InventoryProductType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={createMutation.isPending}
          >
            <option value="MEAT_RABBIT">Carne de Conejo</option>
            <option value="MEAT_CHICKEN">Carne de Pollo</option>
            <option value="MEAT_COW">Carne de Res</option>
            <option value="MEAT_SHEEP">Carne de Oveja</option>
            <option value="EGGS">Huevos</option>
            <option value="MILK">Leche</option>
            <option value="CHEESE">Queso</option>
            <option value="BUTTER">Mantequilla</option>
            <option value="WOOL">Lana</option>
            <option value="HONEY">Miel</option>
            <option value="WAX">Cera</option>
            <option value="OTHER">Otros</option>
          </select>
        </div>

        <div>
          <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            id="product_name"
            type="text"
            value={productData.product_name}
            onChange={(e) => setProductData({ ...productData, product_name: e.target.value })}
            placeholder="Ej: Conejo - SitoSito 8"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={createMutation.isPending}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              min="0"
              value={productData.quantity || ''}
              onChange={(e) => setProductData({ ...productData, quantity: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unidad <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              value={productData.unit}
              onChange={(e) => setProductData({ ...productData, unit: e.target.value as InventoryUnit })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={createMutation.isPending}
            >
              <option value="KG">Kilogramos (KG)</option>
              <option value="GRAMS">Gramos</option>
              <option value="LITERS">Litros</option>
              <option value="UNITS">Unidades</option>
              <option value="DOZENS">Docenas</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="production_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Producción
            </label>
            <input
              id="production_date"
              type="date"
              value={productData.production_date || ''}
              onChange={(e) => setProductData({ ...productData, production_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="expiration_date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Vencimiento
            </label>
            <input
              id="expiration_date"
              type="date"
              value={productData.expiration_date || ''}
              onChange={(e) => setProductData({ ...productData, expiration_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={createMutation.isPending}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              id="location"
              type="text"
              value={productData.location || ''}
              onChange={(e) => setProductData({ ...productData, location: e.target.value })}
              placeholder="Ej: congelador, almacén"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={createMutation.isPending}
            />
          </div>

          <div>
            <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 mb-1">
              Precio Unitario
            </label>
            <input
              id="unit_price"
              type="number"
              step="0.01"
              min="0"
              value={productData.unit_price || ''}
              onChange={(e) => setProductData({ ...productData, unit_price: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={createMutation.isPending}
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notas
          </label>
          <textarea
            id="notes"
            value={productData.notes || ''}
            onChange={(e) => setProductData({ ...productData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={createMutation.isPending}
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
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {createMutation.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creando...</span>
              </>
            ) : (
              <span>Crear Producto</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

