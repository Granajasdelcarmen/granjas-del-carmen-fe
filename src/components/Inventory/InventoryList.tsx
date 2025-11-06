import React, { useState } from 'react';
import { Inventory } from 'src/types/api';
import { InventoryCard } from './InventoryCard';
import { InventoryModal } from './InventoryModal';
import { DataList } from 'src/components/Common/DataList';

interface InventoryListProps {
  items: Inventory[];
  isLoading?: boolean;
  onEditItem?: (item: Inventory) => void;
  onDeleteItem?: (itemId: string) => void;
}

export function InventoryList({ items, isLoading, onEditItem, onDeleteItem }: InventoryListProps) {
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewItem = (item: Inventory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };
  return (
    <>
      <DataList
        items={items}
        isLoading={isLoading}
        gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
        emptyState={{
          icon: '📦',
          title: 'No hay items en el inventario',
          description: 'Agrega el primer item para comenzar',
        }}
        renderItem={(item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onView={handleViewItem}
          />
        )}
      />
      
      <InventoryModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
      />
    </>
  );
}
