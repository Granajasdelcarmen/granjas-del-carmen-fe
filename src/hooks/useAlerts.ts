import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from 'src/services/alertService';
import { Alert, DeclineAlertRequest } from 'src/types/api';
import { logger } from 'src/utils/logger';

// Query keys factory
export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (status: string) => [...alertKeys.lists(), status] as const,
};

/**
 * Hook para obtener alertas activas (PENDING)
 */
export const useAlerts = (status: 'PENDING' | 'ACKNOWLEDGED' | 'DONE' | 'EXPIRED' = 'PENDING') => {
  return useQuery({
    queryKey: alertKeys.list(status),
    queryFn: () => alertService.getAlerts(status),
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

/**
 * Hook para completar una alerta
 * Para alertas de sacrificio, se puede proporcionar la lista de IDs de conejos sacrificados
 */
export const useCompleteAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, slaughteredRabbitIds }: { alertId: number; slaughteredRabbitIds?: string[] }) => 
      alertService.completeAlert(alertId, slaughteredRabbitIds),
    onSuccess: () => {
      // Invalidar todas las queries de alertas y animales
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
    onError: (error) => {
      logger.error('Error al completar alerta', error);
    },
  });
};

/**
 * Hook para declinar una alerta
 */
export const useDeclineAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ alertId, reason }: { alertId: number; reason: string }) =>
      alertService.declineAlert(alertId, reason),
    onSuccess: () => {
      // Invalidar todas las queries de alertas
      queryClient.invalidateQueries({ queryKey: alertKeys.all });
    },
    onError: (error) => {
      logger.error('Error al declinar alerta', error);
    },
  });
};

