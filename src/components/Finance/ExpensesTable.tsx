import React from 'react';
import { Expense, ExpenseCategory } from 'src/types/api';

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading?: boolean;
  sortBy?: 'asc' | 'desc';
  onSortChange?: (sortBy: 'asc' | 'desc') => void;
  onEdit?: (expense: Expense) => void;
  onDelete?: (expenseId: string) => void;
}

export function ExpensesTable({ expenses, isLoading, sortBy, onSortChange, onEdit, onDelete }: ExpensesTableProps) {
  const getCategoryLabel = (category: ExpenseCategory) => {
    switch (category) {
      case 'alimentacion': return 'Alimentación';
      case 'medicamentos': return 'Medicamentos';
      case 'mantenimiento': return 'Mantenimiento';
      case 'personal': return 'Personal';
      case 'servicios': return 'Servicios';
      case 'equipos': return 'Equipos';
      case 'otros': return 'Otros';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay gastos registrados</h3>
        <p className="text-gray-500">Crea el primer gasto para comenzar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <button
                    onClick={() => onSortChange?.(sortBy === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Fecha</span>
                    <span className="text-xs">{sortBy === 'asc' ? '↑' : '↓'}</span>
                  </button>
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getCategoryLabel(expense.category)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {expense.description}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(expense.expense_date)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {expense.vendor || '-'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded min-h-[32px] min-w-[32px]"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(expense.id)}
                        className="text-red-600 hover:text-red-900 px-2 py-1 rounded min-h-[32px] min-w-[32px]"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

