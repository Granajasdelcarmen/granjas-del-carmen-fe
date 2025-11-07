import React from 'react';
import { ProductSale, ProductType } from 'src/types/api';

interface ProductSalesTableProps {
  sales: ProductSale[];
  isLoading?: boolean;
  sortBy?: 'asc' | 'desc';
  onSortChange?: (sortBy: 'asc' | 'desc') => void;
  onEdit?: (sale: ProductSale) => void;
  onDelete?: (saleId: string) => void;
}

export function ProductSalesTable({ sales, isLoading, sortBy, onSortChange, onEdit, onDelete }: ProductSalesTableProps) {
  // Defensive check: ensure sales is always an array
  const safeSales = Array.isArray(sales) ? sales : [];
  
  const getProductTypeLabel = (type: ProductType) => {
    switch (type) {
      case 'miel': return 'Miel';
      case 'huevos': return 'Huevos';
      case 'leche': return 'Leche';
      case 'otros': return 'Otros';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (safeSales.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay ventas registradas</h3>
        <p className="text-gray-500">Crea la primera venta para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => onSortChange?.(sortBy === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Fecha</span>
                    <span className="text-xs">{sortBy === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductTypeLabel(sale.product_type)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.quantity}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(sale.unit_price)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(sale.total_price)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.sale_date)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.customer_name || '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(sale)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded min-h-[32px] min-w-[32px]"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(sale.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded min-h-[32px] min-w-[32px]"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

