import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { User } from '../types/api';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook para obtener todos los usuarios
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para crear un usuario de prueba
export const useSeedUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.seedUser(),
    onSuccess: (newUser) => {
      // Invalidar y refetch la lista de usuarios
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      console.log('Usuario creado:', newUser);
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error);
    },
  });
};

// Hook para refetch manual de usuarios
export const useRefetchUsers = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: userKeys.lists() });
  };
};
