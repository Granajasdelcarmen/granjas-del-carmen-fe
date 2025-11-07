import React, { useState } from 'react';
import { useProductSales, useCreateProductSale, useUpdateProductSale, useDeleteProductSale } from 'src/hooks/useProductSales';
import { ProductSalesTable } from './ProductSalesTable';
import { ProductSaleCreateModal } from './ProductSaleCreateModal';
import { ProductSale, ProductSaleCreate } from 'src/types/api';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';
import { CreateButton } from 'src/components/Common/CreateButton';

export function ProductSalesSection() {
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | undefined>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<ProductSale | null>(null);

  const { data: salesData, isLoading, refetch } = useProductSales(sortBy);
  // Ensure sales is always an array
  const sales = Array.isArray(salesData) ? salesData : [];
  const createMutation = useCreateProductSale();
  const updateMutation = useUpdateProductSale();
  const deleteMutation = useDeleteProductSale();

  const handleCreate = () => {
    setEditingSale(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (sale: ProductSale) => {
    setEditingSale(sale);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (saleId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      try {
        await deleteMutation.mutateAsync(saleId);
      } catch (error) {
        alert('Error al eliminar la venta');
      }
    }
  };

  const handleSubmit = async (saleData: ProductSaleCreate) => {
    try {
      if (editingSale) {
        await updateMutation.mutateAsync({ id: editingSale.id, data: saleData });
      } else {
        await createMutation.mutateAsync(saleData);
      }
      setIsCreateModalOpen(false);
      setEditingSale(null);
    } catch (error: any) {
      alert(error?.message || 'Error al guardar la venta');
    }
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setEditingSale(null);
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.total_price, 0);

  return (
    <SectionWrapper
      title="Ventas de Productos"
      description={`Total de ventas: ${sales.length} | Total: $${totalSales.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      actions={
        <>
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          <CreateButton onClick={handleCreate} label="Nueva Venta" />
        </>
      }
    >
      <ProductSalesTable
        sales={sales}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isCreateModalOpen && (
        <ProductSaleCreateModal
          sale={editingSale}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </SectionWrapper>
  );
}

