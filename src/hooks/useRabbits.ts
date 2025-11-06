import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rabbitService } from 'src/services/rabbitService';
import { Rabbit, RabbitCreate, RabbitUpdate } from 'src/types/api';

// Query keys
export const rabbitKeys = {
  all: ['rabbits'] as const,
  lists: () => [...rabbitKeys.all, 'list'] as const,
  list: (filters: string) => [...rabbitKeys.lists(), { filters }] as const,
  sorted: (order: 'asc' | 'desc' | undefined, discarded?: boolean | null) => 
    [...rabbitKeys.lists(), 'sorted', order ?? 'none', 'discarded', discarded ?? false] as const,
  details: () => [...rabbitKeys.all, 'detail'] as const,
  detail: (id: string) => [...rabbitKeys.details(), id] as const,
  byGender: (gender: string, sortBy?: 'asc' | 'desc', discarded?: boolean | null) => 
    [...rabbitKeys.all, 'gender', gender, sortBy ?? 'none', 'discarded', discarded ?? false] as const,
};

// Hook para obtener todos los conejos (con orden opcional y filtro discarded)
export const useRabbits = (sortBy?: 'asc' | 'desc', discarded: boolean | null = false) => {
  return useQuery({
    queryKey: rabbitKeys.sorted(sortBy, discarded),
    queryFn: () => rabbitService.getRabbits(sortBy, discarded),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obtener un conejo por ID
export const useRabbit = (id: string) => {
  return useQuery({
    queryKey: rabbitKeys.detail(id),
    queryFn: () => rabbitService.getRabbitById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para obtener conejos por género (con orden opcional y filtro discarded)
export const useRabbitsByGender = (
  gender: 'MALE' | 'FEMALE', 
  enabled: boolean = true,
  sortBy?: 'asc' | 'desc',
  discarded: boolean | null = false
) => {
  return useQuery({
    queryKey: rabbitKeys.byGender(gender, sortBy, discarded),
    queryFn: () => rabbitService.getRabbitsByGender(gender, sortBy, discarded),
    enabled: enabled && !!gender,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear un conejo
export const useCreateRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rabbitData: RabbitCreate) => rabbitService.createRabbit(rabbitData),
    onSuccess: (newRabbit) => {
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
    },
    onError: (error) => {
      console.error('Error al crear conejo:', error);
    },
  });
};

// Hook para actualizar un conejo
export const useUpdateRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rabbitData }: { id: string; rabbitData: RabbitUpdate }) => 
      rabbitService.updateRabbit(id, rabbitData),
    onSuccess: (updatedRabbit, { id }) => {
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rabbitKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al actualizar conejo:', error);
    },
  });
};

// Hook para eliminar un conejo
export const useDeleteRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rabbitService.deleteRabbit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rabbitKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al eliminar conejo:', error);
    },
  });
};

// Hook para descartar un conejo
export const useDiscardRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      rabbitService.discardRabbit(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rabbitKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al descartar conejo:', error);
    },
  });
};

// Hook para vender un conejo
export const useSellRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, saleData }: { id: string; saleData: { price: number; weight?: number; height?: number; notes?: string; sold_by: string; reason?: string } }) => 
      rabbitService.sellRabbit(id, saleData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rabbitKeys.detail(id) });
    },
    onError: (error) => {
      console.error('Error al vender conejo:', error);
    },
  });
};

// Hook para refetch manual de conejos
export const useRefetchRabbits = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
  };
};
