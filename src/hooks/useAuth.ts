import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from 'src/services/authService';

export function useAuth() {
  const [isInitialized, setIsInitialized] = useState(false);
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
    enabled: isInitialized,
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
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        await refetchUser();
      }
      setIsInitialized(true);
    };
    initAuth();
  }, [refetchUser]);

  const handleAuthCallback = async (): Promise<boolean> => {
    const success = await authService.handleAuthCallback();
    if (success) {
      await refetchUser();
    }
    return success;
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || !isInitialized,
    isError,
    error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    refetchUser,
    handleAuthCallback,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
