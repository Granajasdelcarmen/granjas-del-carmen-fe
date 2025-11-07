import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from 'src/services/inventoryService';
import { InventoryCreate } from 'src/types/api';
import { logger } from 'src/utils/logger';

// Query keys
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

// Hook para obtener todo el inventario
export const useInventory = () => {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: () => inventoryService.getInventory(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un item del inventario por ID
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.getInventoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear un item del inventario
export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: InventoryCreate) => inventoryService.createInventoryItem(itemData),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
    onError: (error) => {
      logger.error('Error al crear item del inventario', error);
    },
  });
};

// Hook para actualizar un item del inventario
export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, itemData }: { id: string; itemData: Partial<InventoryCreate> }) => 
      inventoryService.updateInventoryItem(id, itemData),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
    onError: (error) => {
      logger.error('Error al actualizar item del inventario', error);
    },
  });
};

// Hook para eliminar un item del inventario
export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventoryItem(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
    onError: (error) => {
      logger.error('Error al eliminar item del inventario', error);
    },
  });
};

// Hook para reemplazar la cantidad exacta
export const useUpdateItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      inventoryService.updateItemQuantity(id, quantity),
    onSuccess: (_updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
  });
};

// Hook para agregar cantidad
export const useAddItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      inventoryService.addItemQuantity(id, amount),
    onSuccess: (_updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
  });
};

// Hook para restar cantidad
export const useSubtractItemQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      inventoryService.subtractItemQuantity(id, amount),
    onSuccess: (_updated, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
  });
};

// Hook para refetch manual del inventario
export const useRefetchInventory = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
  };
};
