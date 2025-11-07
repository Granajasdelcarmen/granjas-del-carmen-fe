import React, { useState } from 'react';
import { InventoryProduct } from 'src/types/api';
import { InventoryProductCard } from './InventoryProductCard';
import { InventoryProductModal } from './InventoryProductModal';
import { DataList } from 'src/components/Common/DataList';

interface InventoryProductsListProps {
  products: InventoryProduct[];
  isLoading?: boolean;
}

export function InventoryProductsList({ products, isLoading }: InventoryProductsListProps) {
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProduct = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <DataList
        items={products}
        isLoading={isLoading}
        gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        emptyState={{
          icon: '📦',
          title: 'No hay productos en inventario',
          description: 'Agrega el primer producto para comenzar',
        }}
        renderItem={(product) => (
          <InventoryProductCard
            key={product.id}
            product={product}
            onView={handleViewProduct}
          />
        )}
      />
      
      <InventoryProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

