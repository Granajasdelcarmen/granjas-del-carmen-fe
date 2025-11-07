import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { 
  InventoryProduct, 
  InventoryProductCreate, 
  InventoryProductUpdate,
  SellProductRequest,
  InventoryTransaction,
  InventoryStatus,
  InventoryProductType
} from 'src/types/api';
import { logger } from 'src/utils/logger';

class InventoryProductService {
  /**
   * Get all inventory products with optional filters
   */
  async getProducts(
    status?: InventoryStatus,
    productType?: InventoryProductType,
    location?: string
  ): Promise<InventoryProduct[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (productType) params.append('product_type', productType);
      if (location) params.append('location', location);
      
      const queryString = params.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.INVENTORY_PRODUCTS}?${queryString}`
        : API_ENDPOINTS.INVENTORY_PRODUCTS;
      
      const products = await apiService.getBackendResponse<InventoryProduct[]>(url);
      return products;
    } catch (error) {
      logger.error('Error fetching inventory products', error);
      throw error;
    }
  }

  /**
   * Get inventory product by ID
   */
  async getProductById(id: string): Promise<InventoryProduct> {
    try {
      const product = await apiService.getBackendResponse<InventoryProduct>(
        API_ENDPOINTS.INVENTORY_PRODUCT_BY_ID(id)
      );
      return product;
    } catch (error) {
      logger.error('Error fetching inventory product', error);
      throw error;
    }
  }

  /**
   * Create a new inventory product
   */
  async createProduct(productData: InventoryProductCreate): Promise<InventoryProduct> {
    try {
      const product = await apiService.postBackendResponse<InventoryProduct>(
        API_ENDPOINTS.INVENTORY_PRODUCT_ADD,
        productData
      );
      return product;
    } catch (error) {
      logger.error('Error creating inventory product', error);
      throw error;
    }
  }

  /**
   * Update an inventory product
   */
  async updateProduct(id: string, productData: InventoryProductUpdate): Promise<InventoryProduct> {
    try {
      const product = await apiService.putBackendResponse<InventoryProduct>(
        API_ENDPOINTS.INVENTORY_PRODUCT_BY_ID(id),
        productData
      );
      return product;
    } catch (error) {
      logger.error('Error updating inventory product', error);
      throw error;
    }
  }

  /**
   * Mark product (or part of it) as sold
   */
  async sellProduct(id: string, saleData: SellProductRequest): Promise<InventoryProduct> {
    try {
      const product = await apiService.postBackendResponse<InventoryProduct>(
        API_ENDPOINTS.INVENTORY_PRODUCT_SELL(id),
        saleData
      );
      return product;
    } catch (error) {
      logger.error('Error selling inventory product', error);
      throw error;
    }
  }

  /**
   * Get all transactions for a product
   */
  async getProductTransactions(id: string): Promise<InventoryTransaction[]> {
    try {
      const transactions = await apiService.getBackendResponse<InventoryTransaction[]>(
        API_ENDPOINTS.INVENTORY_PRODUCT_TRANSACTIONS(id)
      );
      return transactions;
    } catch (error) {
      logger.error('Error fetching product transactions', error);
      throw error;
    }
  }

  /**
   * Get all expired products
   */
  async getExpiredProducts(): Promise<InventoryProduct[]> {
    try {
      const products = await apiService.getBackendResponse<InventoryProduct[]>(
        API_ENDPOINTS.INVENTORY_PRODUCTS_EXPIRED
      );
      return products;
    } catch (error) {
      logger.error('Error fetching expired products', error);
      throw error;
    }
  }
}

export const inventoryProductService = new InventoryProductService();

