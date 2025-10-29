import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rabbitService } from 'src/services/rabbitService';
import { Rabbit } from 'src/types/api';

// Query keys
export const rabbitKeys = {
  all: ['rabbits'] as const,
  lists: () => [...rabbitKeys.all, 'list'] as const,
  list: (filters: string) => [...rabbitKeys.lists(), { filters }] as const,
  details: () => [...rabbitKeys.all, 'detail'] as const,
  detail: (id: string) => [...rabbitKeys.details(), id] as const,
};

// Hook para obtener todos los conejos
export const useRabbits = () => {
  return useQuery({
    queryKey: rabbitKeys.lists(),
    queryFn: () => rabbitService.getRabbits(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear un conejo
export const useAddRabbit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rabbitData: Partial<Rabbit>) => rabbitService.addRabbit(rabbitData),
    onSuccess: (newRabbit) => {
      // Invalidar y refetch la lista de conejos
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Rabbit> }) => 
      rabbitService.updateRabbit(id, data),
    onSuccess: (updatedRabbit) => {
      // Invalidar y refetch la lista de conejos
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
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
    onSuccess: () => {
      // Invalidar y refetch la lista de conejos
      queryClient.invalidateQueries({ queryKey: rabbitKeys.lists() });
      console.log('Conejo eliminado exitosamente');
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
