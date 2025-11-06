import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from 'src/services/authService';

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    isError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: true,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: () => authService.login(),
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.removeQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['rabbits'] });
    },
  });

  useEffect(() => {
    // Nada adicional: la cookie de sesión del BE define autenticación
  }, []);

  const handleAuthCallback = async (): Promise<boolean> => {
    const success = await authService.handleAuthCallback();
    if (success) {
      await refetchUser();
    }
    return success;
  };

  // Role helpers
  const isAdmin = !!(user && (user as any).role === 'admin');
  const isUser = !!(user && (user as any).role === 'user');
  const isViewer = !!(user && (user as any).role === 'viewer');
  const isTrabajador = !!(user && (user as any).role === 'trabajador');
  const canAccessAdmin = isAdmin; // Only admins can access admin panel
  const canEdit = isAdmin || isUser || isTrabajador; // Admins, users, and trabajadores can edit/create animals
  const canView = isAdmin || isUser || isViewer || isTrabajador; // All roles can view
  const canSellOrDiscard = isAdmin; // Only admins can sell or discard animals

  return {
    user,
    isAuthenticated: !!(user && (user as any).sub),
    isLoading,
    isError,
    error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refetchUser,
    handleAuthCallback,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    // Role helpers
    isAdmin,
    isUser,
    isViewer,
    isTrabajador,
    canAccessAdmin,
    canEdit,
    canView,
    canSellOrDiscard,
  };
}
