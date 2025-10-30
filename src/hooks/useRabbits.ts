import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rabbitService } from 'src/services/rabbitService';
import { Rabbit, RabbitCreate, RabbitUpdate } from 'src/types/api';

// Query keys
export const rabbitKeys = {
  all: ['rabbits'] as const,
  lists: () => [...rabbitKeys.all, 'list'] as const,
  list: (filters: string) => [...rabbitKeys.lists(), { filters }] as const,
  sorted: (order: 'asc' | 'desc' | undefined) => [...rabbitKeys.lists(), 'sorted', order ?? 'none'] as const,
  details: () => [...rabbitKeys.all, 'detail'] as const,
  detail: (id: string) => [...rabbitKeys.details(), id] as const,
  byGender: (gender: string) => [...rabbitKeys.all, 'gender', gender] as const,
};

// Hook para obtener todos los conejos (con orden opcional)
export const useRabbits = (sortBy?: 'asc' | 'desc') => {
  return useQuery({
    queryKey: rabbitKeys.sorted(sortBy),
    queryFn: () => rabbitService.getRabbits(sortBy),
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

// Hook para obtener conejos por género
export const useRabbitsByGender = (gender: 'MALE' | 'FEMALE') => {
  return useQuery({
    queryKey: rabbitKeys.byGender(gender),
    queryFn: () => rabbitService.getRabbitsByGender(gender),
    enabled: !!gender,
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
      console.log('Conejo creado:', newRabbit);
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
      console.log('Conejo actualizado:', updatedRabbit);
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
      console.log('Conejo eliminado');
    },
    onError: (error) => {
      console.error('Error al eliminar conejo:', error);
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
