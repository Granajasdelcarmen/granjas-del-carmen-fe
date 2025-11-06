import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from 'src/services/expenseService';
import { Expense, ExpenseCreate } from 'src/types/api';

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (sortBy?: 'asc' | 'desc') => [...expenseKeys.lists(), { sortBy }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

// Hook para obtener todos los gastos
export const useExpenses = (sortBy?: 'asc' | 'desc') =>
  useQuery({
    queryKey: expenseKeys.list(sortBy),
    queryFn: () => expenseService.getExpenses(sortBy),
  });

// Hook para obtener un gasto por ID
export const useExpense = (id: string) =>
  useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.getExpenseById(id),
    enabled: !!id,
  });

// Hook para crear un gasto
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseData: ExpenseCreate) => expenseService.createExpense(expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
};

// Hook para actualizar un gasto
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseCreate> }) =>
      expenseService.updateExpense(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: expenseKeys.detail(variables.id) });
    },
  });
};

// Hook para eliminar un gasto
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
    },
  });
};

