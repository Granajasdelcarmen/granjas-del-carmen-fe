import React, { useState, useMemo } from 'react';
import { useInventoryProducts } from 'src/hooks/useInventoryProducts';
import { InventoryProductsList } from './InventoryProductsList';
import { InventoryProductCreateModal } from './InventoryProductCreateModal';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';
import { CreateButton } from 'src/components/Common/CreateButton';
import { InventoryStatus, InventoryProductType } from 'src/types/api';

export function InventoryProductsSection() {
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | undefined>(undefined);
  const [productTypeFilter, setProductTypeFilter] = useState<InventoryProductType | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: products, isLoading, error, refetch } = useInventoryProducts(
    statusFilter,
    productTypeFilter,
    locationFilter || undefined
  );

  const availableCount = useMemo(() => {
    return products?.filter(p => p.status === 'AVAILABLE').length || 0;
  }, [products]);

  const expiredCount = useMemo(() => {
    return products?.filter(p => p.status === 'EXPIRED').length || 0;
  }, [products]);

  const handleRefetch = () => {
    refetch();
  };

  return (
    <SectionWrapper
      title="Productos en Inventario"
      icon="📦"
      description="Gestiona productos disponibles para venta (miel, lana, huevos, conejos sacrificados, etc.)"
      count={products?.length || 0}
      countLabel="productos"
      error={error || undefined}
      onRetry={handleRefetch}
      errorTitle="Error al cargar productos"
      actions={
        <>
          <CreateButton
            onClick={() => setIsCreateOpen(true)}
            label="Añadir Producto"
          />
          <RefreshButton onClick={handleRefetch} isLoading={isLoading} />
        </>
      }
    >
      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value as InventoryStatus || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="AVAILABLE">Disponible</option>
            <option value="RESERVED">Reservado</option>
            <option value="SOLD">Vendido</option>
            <option value="EXPIRED">Vencido</option>
            <option value="DISCARDED">Descartado</option>
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={productTypeFilter || ''}
            onChange={(e) => setProductTypeFilter(e.target.value as InventoryProductType || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
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

        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Ej: congelador"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Alertas */}
      {(expiredCount > 0 || availableCount > 0) && (
        <div className="flex space-x-4 mb-4">
          {expiredCount > 0 && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              ⚠️ {expiredCount} producto(s) vencido(s)
            </span>
          )}
          {availableCount > 0 && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              ✓ {availableCount} producto(s) disponible(s)
            </span>
          )}
        </div>
      )}

      <InventoryProductsList products={products || []} isLoading={isLoading} />
      <InventoryProductCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </SectionWrapper>
  );
}

