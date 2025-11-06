import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Expense, ExpenseCreate, ApiResponse } from '../types/api';

class ExpenseService {
  /**
   * Get all expenses
   */
  async getExpenses(sortBy?: 'asc' | 'desc'): Promise<Expense[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      
      const url = `${API_ENDPOINTS.EXPENSES}${params.toString() ? `?${params.toString()}` : ''}`;
      const expenses = await apiService.getBackendResponse<Expense[]>(url);
      return expenses;
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      console.error('Error response:', error?.response);
      console.error('Error status:', error?.response?.status);
      console.error('Error data:', error?.response?.data);
      throw error;
    }
  }

  /**
   * Get expense by ID
   */
  async getExpenseById(id: string): Promise<Expense> {
    try {
      const expense = await apiService.getBackendResponse<Expense>(API_ENDPOINTS.EXPENSE_BY_ID(id));
      return expense;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  }

  /**
   * Create a new expense
   */
  async createExpense(expenseData: ExpenseCreate): Promise<Expense> {
    try {
      const expense = await apiService.postBackendResponse<Expense>(API_ENDPOINTS.EXPENSES, expenseData);
      return expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  /**
   * Update expense by ID
   */
  async updateExpense(id: string, expenseData: Partial<ExpenseCreate>): Promise<Expense> {
    try {
      const expense = await apiService.putBackendResponse<Expense>(API_ENDPOINTS.EXPENSE_BY_ID(id), expenseData);
      return expense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  /**
   * Delete expense by ID
   */
  async deleteExpense(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.EXPENSE_BY_ID(id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();

