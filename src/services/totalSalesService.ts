import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { TotalSale } from '../types/api';
import { logger } from '../utils/logger';

class TotalSalesService {
  /**
   * Get all sales (products + animals) consolidated
   */
  async getTotalSales(sortBy?: 'asc' | 'desc'): Promise<TotalSale[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      
      const url = `${API_ENDPOINTS.TOTAL_SALES}${params.toString() ? `?${params.toString()}` : ''}`;
      const sales = await apiService.getBackendResponse<TotalSale[]>(url);
      return sales;
    } catch (error: any) {
      logger.error('Error fetching total sales', error);
      throw error;
    }
  }
}

export const totalSalesService = new TotalSalesService();

