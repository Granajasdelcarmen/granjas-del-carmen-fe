import React from 'react';
import { TotalSale, ProductType, AnimalType } from 'src/types/api';
import { ANIMAL_SPECIES, ANIMAL_SPECIES_LABELS } from 'src/constants/animals';

interface TotalSalesTableProps {
  sales: TotalSale[];
  isLoading?: boolean;
  sortBy?: 'asc' | 'desc';
  onSortChange?: (sortBy: 'asc' | 'desc') => void;
}

export function TotalSalesTable({ sales, isLoading, sortBy, onSortChange }: TotalSalesTableProps) {
  const safeSales = Array.isArray(sales) ? sales : [];
  
  const getProductTypeLabel = (type?: ProductType) => {
    if (!type) return '-';
    switch (type) {
      case 'miel': return 'Miel';
      case 'huevos': return 'Huevos';
      case 'leche': return 'Leche';
      case 'otros': return 'Otros';
      default: return type;
    }
  };

  const getAnimalTypeLabel = (type?: AnimalType) => {
    if (!type) return '-';
    switch (type) {
      case ANIMAL_SPECIES.RABBIT: return ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.RABBIT];
      case ANIMAL_SPECIES.COW: return ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.COW];
      case ANIMAL_SPECIES.SHEEP: return ANIMAL_SPECIES_LABELS[ANIMAL_SPECIES.SHEEP];
      case 'CHICKEN': return 'Pollo';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
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
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td colSpan={4} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                Cargando...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (safeSales.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm sm:text-base">No hay ventas registradas</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => onSortChange && onSortChange(sortBy === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Fecha</span>
                    {sortBy === 'desc' ? '↓' : '↑'}
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sale.sale_type === 'product' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {sale.sale_type === 'product' ? 'Producto' : 'Animal'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900">
                    {sale.sale_type === 'product' ? (
                      <>
                        <div className="font-medium">{getProductTypeLabel(sale.product_type)}</div>
                        {sale.quantity && sale.unit_price && (
                          <div className="text-xs text-gray-500">
                            {sale.quantity} x {formatCurrency(sale.unit_price)}
                          </div>
                        )}
                        {sale.customer_name && (
                          <div className="text-xs text-gray-500">Cliente: {sale.customer_name}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="font-medium">{sale.animal_name || 'Animal'}</div>
                        <div className="text-xs text-gray-500">{getAnimalTypeLabel(sale.animal_type)}</div>
                        {sale.weight && (
                          <div className="text-xs text-gray-500">Peso: {sale.weight} kg</div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.sale_date)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(sale.total_price)}
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

