import React from 'react';
import { useInventory, useRefetchInventory } from 'src/hooks/useInventory';
import { InventoryList } from './InventoryList';
import { InventoryCreateModal } from './InventoryCreateModal';

export function InventorySection() {
  const { data: items, isLoading, error, isError } = useInventory();
  const refetchInventory = useRefetchInventory();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  // Debug log
  console.log('InventorySection - items:', items);
  console.log('InventorySection - isLoading:', isLoading);
  console.log('InventorySection - error:', error);

  const handleRefetch = () => {
    refetchInventory();
  };

  const getLowStockCount = () => {
    return Array.isArray(items) ? items.filter(item => item.quantity < 10).length : 0;
  };

  const getOutOfStockCount = () => {
    return Array.isArray(items) ? items.filter(item => item.quantity === 0).length : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Inventario</h2>
            <p className="text-sm text-gray-500">
              Gestiona el inventario de la granja ({Array.isArray(items) ? items.length : 0} items)
            </p>
            {(getLowStockCount() > 0 || getOutOfStockCount() > 0) && (
              <div className="flex space-x-4 mt-2">
                {getOutOfStockCount() > 0 && (
                  <span className="text-xs text-red-600">
                    ❌ {getOutOfStockCount()} sin stock
                  </span>
                )}
                {getLowStockCount() > 0 && (
                  <span className="text-xs text-yellow-600">
                    ⚠️ {getLowStockCount()} stock bajo
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Añadir item
            </button>
            <button
              onClick={handleRefetch}
              disabled={isLoading}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title={isLoading ? 'Cargando...' : 'Actualizar'}
              aria-label={isLoading ? 'Cargando' : 'Actualizar'}
            >
              {isLoading ? (
                'Cargando...'
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-5 h-5 transition-transform duration-300 hover:rotate-180">
                  <path d="M16.023 9.348h4.992V4.356" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2.25 12a9.75 9.75 0 0 1 16.5-6.864" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.977 14.652H2.985v4.992" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21.75 12a9.75 9.75 0 0 1-16.5 6.864" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isError ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar inventario</h3>
            <p className="text-gray-500 mb-4">{error?.message || 'Error desconocido'}</p>
            <button
              onClick={handleRefetch}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <InventoryList items={items || []} isLoading={isLoading} />
            <InventoryCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
          </>
        )}
      </div>
    </div>
  );
}
