import React from 'react';
import { useInventory, useRefetchInventory } from 'src/hooks/useInventory';
import { InventoryList } from './InventoryList';
import { InventoryCreateModal } from './InventoryCreateModal';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';
import { CreateButton } from 'src/components/Common/CreateButton';

export function InventorySection() {
  const { data: items, isLoading, error, isError } = useInventory();
  const refetchInventory = useRefetchInventory();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

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
    <SectionWrapper
      title="Inventario"
      icon="📦"
      description="Gestiona el inventario de la granja"
      count={Array.isArray(items) ? items.length : 0}
      countLabel="items"
      error={error || undefined}
      onRetry={handleRefetch}
      errorTitle="Error al cargar inventario"
      actions={
        <>
          <CreateButton
            onClick={() => setIsCreateOpen(true)}
            label="Añadir item"
          />
          <RefreshButton onClick={handleRefetch} isLoading={isLoading} />
        </>
      }
    >
      {(getLowStockCount() > 0 || getOutOfStockCount() > 0) && (
        <div className="flex space-x-4 mb-4">
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
      <InventoryList items={items || []} isLoading={isLoading} />
      <InventoryCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </SectionWrapper>
  );
}
