import React, { useState, useEffect } from 'react';
import { Modal } from 'src/components/Common/Modal';
import { Expense, ExpenseCreate, ExpenseCategory } from 'src/types/api';

interface ExpenseCreateModalProps {
  expense?: Expense | null;
  onClose: () => void;
  onSubmit: (expenseData: ExpenseCreate) => Promise<void>;
  isSubmitting?: boolean;
}

export function ExpenseCreateModal({ expense, onClose, onSubmit, isSubmitting }: ExpenseCreateModalProps) {
  const [category, setCategory] = useState<ExpenseCategory>('alimentacion');
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [expenseDate, setExpenseDate] = useState<string>('');
  const [vendor, setVendor] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setDescription(expense.description);
      setAmount(expense.amount.toString());
      setExpenseDate(expense.expense_date.split('T')[0]);
      setVendor(expense.vendor || '');
      setNotes(expense.notes || '');
    } else {
      // Default to today's date
      const today = new Date().toISOString().split('T')[0];
      setExpenseDate(today);
    }
  }, [expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData: ExpenseCreate = {
      category,
      description,
      amount: parseFloat(amount),
      expense_date: new Date(expenseDate).toISOString(),
      vendor: vendor || undefined,
      notes: notes || undefined,
    };

    await onSubmit(expenseData);
  };

  const canSubmit = description.trim().length > 0 && amount && parseFloat(amount) > 0 && expenseDate;

  return (
    <Modal isOpen={true} onClose={onClose} title={expense ? 'Editar Gasto' : 'Nuevo Gasto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-h-[44px]"
            >
              <option value="alimentacion">Alimentación</option>
              <option value="medicamentos">Medicamentos</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="personal">Personal</option>
              <option value="servicios">Servicios</option>
              <option value="equipos">Equipos</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha del Gasto</label>
            <input
              type="date"
              required
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
            placeholder="Descripción del gasto"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Monto</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Proveedor (opcional)</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              placeholder="Nombre del proveedor"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas (opcional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notas adicionales sobre el gasto"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium min-h-[44px]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-h-[44px]"
          >
            {isSubmitting ? 'Guardando...' : expense ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

