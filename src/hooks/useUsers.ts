import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from 'src/services/userService';
import { User, UserCreate } from 'src/types/api';

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

// Hook para obtener un usuario por ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para crear un usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: UserCreate) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Hook para actualizar un usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<UserCreate> }) => 
      userService.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
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

// Hook para actualizar el rol de un usuario
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => 
      userService.updateUserRole(id, role),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
    },
  });
};