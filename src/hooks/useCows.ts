import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cowService } from 'src/services/cowService';
import { Cow, CowCreate, CowUpdate } from 'src/types/api';

// Query keys
export const cowKeys = {
  all: ['cows'] as const,
  lists: () => [...cowKeys.all, 'list'] as const,
  list: (filters: string) => [...cowKeys.lists(), { filters }] as const,
  sorted: (order: 'asc' | 'desc' | undefined, discarded?: boolean | null) => 
    [...cowKeys.lists(), 'sorted', order ?? 'none', 'discarded', discarded ?? false] as const,
  details: () => [...cowKeys.all, 'detail'] as const,
  detail: (id: string) => [...cowKeys.details(), id] as const,
  byGender: (gender: string, sortBy?: 'asc' | 'desc', discarded?: boolean | null) => 
    [...cowKeys.all, 'gender', gender, sortBy ?? 'none', 'discarded', discarded ?? false] as const,
};

// Hook para obtener todas las vacas (con orden opcional y filtro discarded)
export const useCows = (sortBy?: 'asc' | 'desc', discarded: boolean | null = false) => {
  return useQuery({
    queryKey: cowKeys.sorted(sortBy, discarded),
    queryFn: () => cowService.getCows(sortBy, discarded),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener una vaca por ID
export const useCow = (id: string) => {
  return useQuery({
    queryKey: cowKeys.detail(id),
    queryFn: () => cowService.getCowById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener vacas por género (con orden opcional y filtro discarded)
export const useCowsByGender = (
  gender: 'MALE' | 'FEMALE', 
  enabled: boolean = true,
  sortBy?: 'asc' | 'desc',
  discarded: boolean | null = false
) => {
  return useQuery({
    queryKey: cowKeys.byGender(gender, sortBy, discarded),
    queryFn: () => cowService.getCowsByGender(gender, sortBy, discarded),
    enabled: enabled && !!gender,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear una vaca
export const useCreateCow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cowData: CowCreate) => cowService.createCow(cowData),
    onSuccess: (newCow) => {
      queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
    },
    onError: (error) => {
      console.error('Error al crear vaca:', error);
    },
  });
};

// Hook para actualizar una vaca
export const useUpdateCow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cowData }: { id: string; cowData: CowUpdate }) => 
      cowService.updateCow(id, cowData),
    onSuccess: (updatedCow, { id }) => {
      queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cowKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al actualizar vaca:', error);
    },
  });
};

// Hook para eliminar una vaca
export const useDeleteCow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cowService.deleteCow(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cowKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al eliminar vaca:', error);
    },
  });
};

// Hook para descartar una vaca
export const useDiscardCow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      cowService.discardCow(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cowKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al descartar vaca:', error);
    },
  });
};

// Hook para vender una vaca
export const useSellCow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, saleData }: { id: string; saleData: { price: number; weight?: number; height?: number; notes?: string; sold_by: string; reason?: string } }) => 
      cowService.sellCow(id, saleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cowKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al vender vaca:', error);
    },
  });
};

// Hook para refetch manual de vacas
export const useRefetchCows = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: cowKeys.lists() });
  };
};

