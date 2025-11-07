import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { ProductSale, ProductSaleCreate, ApiResponse } from '../types/api';
import { logger } from '../utils/logger';

class ProductSaleService {
  /**
   * Get all product sales
   */
  async getProductSales(sortBy?: 'asc' | 'desc'): Promise<ProductSale[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      
      const url = `${API_ENDPOINTS.PRODUCT_SALES}${params.toString() ? `?${params.toString()}` : ''}`;
      const sales = await apiService.getBackendResponse<ProductSale[]>(url);
      return sales;
    } catch (error) {
      logger.error('Error fetching product sales', error);
      throw error;
    }
  }

  /**
   * Get product sale by ID
   */
  async getProductSaleById(id: string): Promise<ProductSale> {
    try {
      const sale = await apiService.getBackendResponse<ProductSale>(API_ENDPOINTS.PRODUCT_SALE_BY_ID(id));
      return sale;
    } catch (error) {
      logger.error('Error fetching product sale', error);
      throw error;
    }
  }

  /**
   * Create a new product sale
   */
  async createProductSale(saleData: ProductSaleCreate): Promise<ProductSale> {
    try {
      const sale = await apiService.postBackendResponse<ProductSale>(API_ENDPOINTS.PRODUCT_SALES, saleData);
      return sale;
    } catch (error) {
      logger.error('Error creating product sale', error);
      throw error;
    }
  }

  /**
   * Update product sale by ID
   */
  async updateProductSale(id: string, saleData: Partial<ProductSaleCreate>): Promise<ProductSale> {
    try {
      const sale = await apiService.putBackendResponse<ProductSale>(API_ENDPOINTS.PRODUCT_SALE_BY_ID(id), saleData);
      return sale;
    } catch (error) {
      logger.error('Error updating product sale', error);
      throw error;
    }
  }

  /**
   * Delete product sale by ID
   */
  async deleteProductSale(id: string): Promise<void> {
    try {
      await apiService.delete(API_ENDPOINTS.PRODUCT_SALE_BY_ID(id));
    } catch (error) {
      logger.error('Error deleting product sale', error);
      throw error;
    }
  }
}

export const productSaleService = new ProductSaleService();

