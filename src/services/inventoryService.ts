import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Inventory, InventoryCreate, ApiResponse } from 'src/types/api';
import { logger } from 'src/utils/logger';

class InventoryService {
  /**
   * Get all inventory items
   */
  async getInventory(): Promise<Inventory[]> {
    try {
      const inventory = await apiService.getBackendResponse<Inventory[]>(API_ENDPOINTS.INVENTORY);
      return inventory;
    } catch (error) {
      logger.error('Error fetching inventory', error);
      throw error;
    }
  }

  /**
   * Get inventory item by ID
   */
  async getInventoryById(id: string): Promise<Inventory> {
    try {
      const item = await apiService.getBackendResponse<Inventory>(API_ENDPOINTS.INVENTORY_BY_ID(id));
      return item;
    } catch (error) {
      logger.error('Error fetching inventory item', error);
      throw error;
    }
  }

  /**
   * Create a new inventory item
   */
  async createInventoryItem(itemData: InventoryCreate): Promise<Inventory> {
    try {
      const item = await apiService.postBackendResponse<Inventory>(API_ENDPOINTS.INVENTORY, itemData);
      return item;
    } catch (error) {
      logger.error('Error creating inventory item', error);
      throw error;
    }
  }

  /**
   * Update inventory item by ID
   */
  async updateInventoryItem(id: string, itemData: Partial<InventoryCreate>): Promise<Inventory> {
    try {
      const item = await apiService.putBackendResponse<Inventory>(API_ENDPOINTS.INVENTORY_BY_ID(id), itemData);
      return item;
    } catch (error) {
      logger.error('Error updating inventory item', error);
      throw error;
    }
  }

  /**
   * Replace item quantity with an exact value
   */
  async updateItemQuantity(id: string, quantity: number): Promise<Inventory> {
    try {
      const item = await apiService.putBackendResponse<Inventory>(`${API_ENDPOINTS.INVENTORY_BY_ID(id)}/quantity`, { quantity });
      return item;
    } catch (error) {
      logger.error('Error updating item quantity', error);
      throw error;
    }
  }

  /**
   * Add amount to item quantity
   */
  async addItemQuantity(id: string, amount: number): Promise<Inventory> {
    try {
      const item = await apiService.postBackendResponse<Inventory>(`${API_ENDPOINTS.INVENTORY_BY_ID(id)}/add`, { amount });
      return item;
    } catch (error) {
      logger.error('Error adding item quantity', error);
      throw error;
    }
  }

  /**
   * Subtract amount from item quantity
   */
  async subtractItemQuantity(id: string, amount: number): Promise<Inventory> {
    try {
      const item = await apiService.postBackendResponse<Inventory>(`${API_ENDPOINTS.INVENTORY_BY_ID(id)}/subtract`, { amount });
      return item;
    } catch (error) {
      logger.error('Error subtracting item quantity', error);
      throw error;
    }
  }

  /**
   * Delete inventory item by ID
   */
  async deleteInventoryItem(id: string): Promise<void> {
    try {
      await apiService.deleteBackendResponse<void>(API_ENDPOINTS.INVENTORY_BY_ID(id));
    } catch (error) {
      logger.error('Error deleting inventory item', error);
      throw error;
    }
  }

  /**
   * Get inventory with full response (including message)
   */
  async getInventoryWithMessage(): Promise<ApiResponse<Inventory[]>> {
    try {
      const response = await apiService.getFullResponse<Inventory[]>(API_ENDPOINTS.INVENTORY);
      return response;
    } catch (error) {
      logger.error('Error fetching inventory with message', error);
      throw error;
    }
  }
}

// Export singleton instance
export const inventoryService = new InventoryService();
export default inventoryService;
