import React, { useState } from 'react';
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from 'src/hooks/useExpenses';
import { ExpensesTable } from './ExpensesTable';
import { ExpenseCreateModal } from './ExpenseCreateModal';
import { Expense, ExpenseCreate } from 'src/types/api';
import { SectionWrapper } from 'src/components/Common/SectionWrapper';
import { RefreshButton } from 'src/components/Common/RefreshButton';
import { CreateButton } from 'src/components/Common/CreateButton';

export function ExpensesSection() {
  const [sortBy, setSortBy] = useState<'asc' | 'desc' | undefined>('desc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { data: expensesData, isLoading, refetch } = useExpenses(sortBy);
  const expenses = Array.isArray(expensesData) ? expensesData : [];
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const handleCreate = () => {
    setEditingExpense(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
      try {
        await deleteMutation.mutateAsync(expenseId);
      } catch (error) {
        alert('Error al eliminar el gasto');
      }
    }
  };

  const handleSubmit = async (expenseData: ExpenseCreate) => {
    try {
      if (editingExpense) {
        await updateMutation.mutateAsync({ id: editingExpense.id, data: expenseData });
      } else {
        await createMutation.mutateAsync(expenseData);
      }
      setIsCreateModalOpen(false);
      setEditingExpense(null);
    } catch (error: any) {
      alert(error?.message || 'Error al guardar el gasto');
    }
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setEditingExpense(null);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <SectionWrapper
      title="Gastos"
      description={`Total de gastos: ${expenses.length} | Total: $${totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      actions={
        <>
          <RefreshButton onClick={() => refetch()} isLoading={isLoading} />
          <CreateButton onClick={handleCreate} label="Nuevo Gasto" />
        </>
      }
    >
      <ExpensesTable
        expenses={expenses}
        isLoading={isLoading}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isCreateModalOpen && (
        <ExpenseCreateModal
          expense={editingExpense}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </SectionWrapper>
  );
}

