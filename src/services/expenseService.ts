import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Expense, ExpenseCreate, ApiResponse } from '../types/api';
import { logger } from '../utils/logger';

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
      logger.error('Error fetching expenses', error, {
        response: error?.response,
        status: error?.response?.status,
        data: error?.response?.data,
      });
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
      logger.error('Error fetching expense', error);
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
      logger.error('Error creating expense', error);
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
      logger.error('Error updating expense', error);
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
      logger.error('Error deleting expense', error);
      throw error;
    }
  }
}

export const expenseService = new ExpenseService();

