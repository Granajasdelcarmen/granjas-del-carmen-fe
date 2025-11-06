import { useQuery } from '@tanstack/react-query';
import { totalSalesService } from 'src/services/totalSalesService';
import { TotalSale } from 'src/types/api';

// Query keys
export const totalSalesKeys = {
  all: ['totalSales'] as const,
  lists: () => [...totalSalesKeys.all, 'list'] as const,
  list: (sortBy?: 'asc' | 'desc') => [...totalSalesKeys.lists(), { sortBy }] as const,
};

// Hook para obtener todas las ventas (productos + animales)
export const useTotalSales = (sortBy?: 'asc' | 'desc') =>
  useQuery({
    queryKey: totalSalesKeys.list(sortBy),
    queryFn: () => totalSalesService.getTotalSales(sortBy),
  });

