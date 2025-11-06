import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productSaleService } from 'src/services/productSaleService';
import { ProductSale, ProductSaleCreate } from 'src/types/api';

// Query keys
export const productSaleKeys = {
  all: ['productSales'] as const,
  lists: () => [...productSaleKeys.all, 'list'] as const,
  list: (sortBy?: 'asc' | 'desc') => [...productSaleKeys.lists(), { sortBy }] as const,
  details: () => [...productSaleKeys.all, 'detail'] as const,
  detail: (id: string) => [...productSaleKeys.details(), id] as const,
};

// Hook para obtener todas las ventas de productos
export const useProductSales = (sortBy?: 'asc' | 'desc') =>
  useQuery({
    queryKey: productSaleKeys.list(sortBy),
    queryFn: () => productSaleService.getProductSales(sortBy),
  });

// Hook para obtener una venta de producto por ID
export const useProductSale = (id: string) =>
  useQuery({
    queryKey: productSaleKeys.detail(id),
    queryFn: () => productSaleService.getProductSaleById(id),
    enabled: !!id,
  });

// Hook para crear una venta de producto
export const useCreateProductSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (saleData: ProductSaleCreate) => productSaleService.createProductSale(saleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSaleKeys.all });
    },
  });
};

// Hook para actualizar una venta de producto
export const useUpdateProductSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductSaleCreate> }) =>
      productSaleService.updateProductSale(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productSaleKeys.all });
      queryClient.invalidateQueries({ queryKey: productSaleKeys.detail(variables.id) });
    },
  });
};

// Hook para eliminar una venta de producto
export const useDeleteProductSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productSaleService.deleteProductSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productSaleKeys.all });
    },
  });
};

