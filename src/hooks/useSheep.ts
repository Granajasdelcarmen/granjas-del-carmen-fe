import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sheepService } from 'src/services/sheepService';
import { Sheep, SheepCreate, SheepUpdate } from 'src/types/api';

// Query keys
export const sheepKeys = {
  all: ['sheep'] as const,
  lists: () => [...sheepKeys.all, 'list'] as const,
  list: (filters: string) => [...sheepKeys.lists(), { filters }] as const,
  sorted: (order: 'asc' | 'desc' | undefined, discarded?: boolean | null) => 
    [...sheepKeys.lists(), 'sorted', order ?? 'none', 'discarded', discarded ?? false] as const,
  details: () => [...sheepKeys.all, 'detail'] as const,
  detail: (id: string) => [...sheepKeys.details(), id] as const,
  byGender: (gender: string, sortBy?: 'asc' | 'desc', discarded?: boolean | null) => 
    [...sheepKeys.all, 'gender', gender, sortBy ?? 'none', 'discarded', discarded ?? false] as const,
};

// Hook para obtener todas las ovejas (con orden opcional y filtro discarded)
export const useSheep = (sortBy?: 'asc' | 'desc', discarded: boolean | null = false) => {
  return useQuery({
    queryKey: sheepKeys.sorted(sortBy, discarded),
    queryFn: () => sheepService.getSheep(sortBy, discarded),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener una oveja por ID
export const useSheepById = (id: string) => {
  return useQuery({
    queryKey: sheepKeys.detail(id),
    queryFn: () => sheepService.getSheepById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener ovejas por género (con orden opcional y filtro discarded)
export const useSheepByGender = (
  gender: 'MALE' | 'FEMALE', 
  enabled: boolean = true,
  sortBy?: 'asc' | 'desc',
  discarded: boolean | null = false
) => {
  return useQuery({
    queryKey: sheepKeys.byGender(gender, sortBy, discarded),
    queryFn: () => sheepService.getSheepByGender(gender, sortBy, discarded),
    enabled: enabled && !!gender,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear una oveja
export const useCreateSheep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sheepData: SheepCreate) => sheepService.createSheep(sheepData),
    onSuccess: (newSheep) => {
      queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
    },
    onError: (error) => {
      console.error('Error al crear oveja:', error);
    },
  });
};

// Hook para actualizar una oveja
export const useUpdateSheep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, sheepData }: { id: string; sheepData: SheepUpdate }) => 
      sheepService.updateSheep(id, sheepData),
    onSuccess: (updatedSheep, { id }) => {
      queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sheepKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al actualizar oveja:', error);
    },
  });
};

// Hook para eliminar una oveja
export const useDeleteSheep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sheepService.deleteSheep(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sheepKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al eliminar oveja:', error);
    },
  });
};

// Hook para descartar una oveja
export const useDiscardSheep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      sheepService.discardSheep(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sheepKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al descartar oveja:', error);
    },
  });
};

// Hook para vender una oveja
export const useSellSheep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, saleData }: { id: string; saleData: { price: number; weight?: number; height?: number; notes?: string; sold_by: string; reason?: string } }) => 
      sheepService.sellSheep(id, saleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sheepKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al vender oveja:', error);
    },
  });
};

// Hook para refetch manual de ovejas
export const useRefetchSheep = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: sheepKeys.lists() });
  };
};

