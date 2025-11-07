import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryProductService } from 'src/services/inventoryProductService';
import {
  InventoryProduct,
  InventoryProductCreate,
  InventoryProductUpdate,
  SellProductRequest,
  InventoryStatus,
  InventoryProductType
} from 'src/types/api';
import { logger } from 'src/utils/logger';

// Query keys factory
export const inventoryProductKeys = {
  all: ['inventory-products'] as const,
  lists: () => [...inventoryProductKeys.all, 'list'] as const,
  list: (filters: string) => [...inventoryProductKeys.lists(), { filters }] as const,
  filtered: (status?: InventoryStatus, productType?: InventoryProductType, location?: string) =>
    [...inventoryProductKeys.lists(), 'filtered', status, productType, location] as const,
  details: () => [...inventoryProductKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryProductKeys.details(), id] as const,
  transactions: (id: string) => [...inventoryProductKeys.detail(id), 'transactions'] as const,
  expired: () => [...inventoryProductKeys.all, 'expired'] as const,
};

/**
 * Hook para obtener productos de inventario con filtros opcionales
 */
export const useInventoryProducts = (
  status?: InventoryStatus,
  productType?: InventoryProductType,
  location?: string
) => {
  return useQuery({
    queryKey: inventoryProductKeys.filtered(status, productType, location),
    queryFn: () => inventoryProductService.getProducts(status, productType, location),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para obtener un producto por ID
 */
export const useInventoryProduct = (id: string) => {
  return useQuery({
    queryKey: inventoryProductKeys.detail(id),
    queryFn: () => inventoryProductService.getProductById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook para crear un producto de inventario
 */
export const useCreateInventoryProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: InventoryProductCreate) =>
      inventoryProductService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryProductKeys.lists() });
    },
    onError: (error) => {
      logger.error('Error al crear producto de inventario', error);
    },
  });
};

/**
 * Hook para actualizar un producto de inventario
 */
export const useUpdateInventoryProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productData }: { id: string; productData: InventoryProductUpdate }) =>
      inventoryProductService.updateProduct(id, productData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryProductKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryProductKeys.detail(id) });
    },
    onError: (error) => {
      logger.error('Error al actualizar producto de inventario', error);
    },
  });
};

/**
 * Hook para vender un producto de inventario
 */
export const useSellInventoryProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, saleData }: { id: string; saleData: SellProductRequest }) =>
      inventoryProductService.sellProduct(id, saleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryProductKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryProductKeys.detail(id) });
    },
    onError: (error) => {
      logger.error('Error al vender producto de inventario', error);
    },
  });
};

/**
 * Hook para obtener transacciones de un producto
 */
export const useProductTransactions = (productId: string) => {
  return useQuery({
    queryKey: inventoryProductKeys.transactions(productId),
    queryFn: () => inventoryProductService.getProductTransactions(productId),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook para obtener productos vencidos
 */
export const useExpiredProducts = () => {
  return useQuery({
    queryKey: inventoryProductKeys.expired(),
    queryFn: () => inventoryProductService.getExpiredProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

