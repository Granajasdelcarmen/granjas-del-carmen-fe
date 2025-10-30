import React, { useState } from 'react';
import { Inventory } from 'src/types/api';
import { InventoryCard } from './InventoryCard';
import { InventoryModal } from './InventoryModal';

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-3 animate-pulse">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay items en el inventario</h3>
        <p className="text-gray-500">Agrega el primer item para comenzar</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {Array.isArray(items) ? items.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
            onView={handleViewItem}
          />
        )) : null}
      </div>
      
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
