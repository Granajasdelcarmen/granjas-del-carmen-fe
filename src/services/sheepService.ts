import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Sheep, SheepCreate, SheepUpdate, ApiResponse, AnimalSale, AnimalSaleCreate } from 'src/types/api';

class SheepService {

  /**
   * Get sheep by ID
   */
  async getSheepById(id: string): Promise<Sheep> {
    try {
      const sheep = await apiService.getBackendResponse<Sheep>(API_ENDPOINTS.SHEEP_BY_ID(id));
      return sheep;
    } catch (error) {
      console.error('Error fetching sheep:', error);
      throw error;
    }
  }


  /**
   * Create a new sheep
   */
  async createSheep(sheepData: SheepCreate): Promise<Sheep> {
    try {
      const sheep = await apiService.postBackendResponse<Sheep>(API_ENDPOINTS.SHEEP_ADD, sheepData);
      return sheep;
    } catch (error) {
      console.error('Error creating sheep:', error);
      throw error;
    }
  }

  /**
   * Update sheep by ID
   */
  async updateSheep(id: string, sheepData: SheepUpdate): Promise<Sheep> {
    try {
      const sheep = await apiService.putBackendResponse<Sheep>(API_ENDPOINTS.SHEEP_BY_ID(id), sheepData);
      return sheep;
    } catch (error) {
      console.error('Error updating sheep:', error);
      throw error;
    }
  }

  /**
   * Delete sheep by ID
   */
  async deleteSheep(id: string): Promise<void> {
    try {
      await apiService.deleteBackendResponse<void>(API_ENDPOINTS.SHEEP_BY_ID(id));
    } catch (error) {
      console.error('Error deleting sheep:', error);
      throw error;
    }
  }

  /**
   * Get sheep with full response (including message)
   */
  async getSheepWithMessage(): Promise<ApiResponse<Sheep[]>> {
    try {
      const response = await apiService.getFullResponse<Sheep[]>(API_ENDPOINTS.SHEEP);
      return response;
    } catch (error) {
      console.error('Error fetching sheep with message:', error);
      throw error;
    }
  }

  /**
   * Get sheep with discarded filter
   */
  async getSheep(sortBy?: 'asc' | 'desc', discarded?: boolean | null): Promise<Sheep[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', String(discarded));
      } else if (discarded === null) {
        params.append('discarded', 'null');
      }
      const url = params.toString() ? `${API_ENDPOINTS.SHEEP}?${params.toString()}` : API_ENDPOINTS.SHEEP;
      const sheep = await apiService.getBackendResponse<Sheep[]>(url);
      return sheep;
    } catch (error) {
      console.error('Error fetching sheep:', error);
      throw error;
    }
  }

  /**
   * Get sheep by gender with optional sort and discarded filter
   */
  async getSheepByGender(gender: 'MALE' | 'FEMALE', sortBy?: 'asc' | 'desc', discarded?: boolean | null): Promise<Sheep[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', String(discarded));
      } else if (discarded === null) {
        params.append('discarded', 'null');
      }
      const base = API_ENDPOINTS.SHEEP_BY_GENDER(gender);
      const url = params.toString() ? `${base}?${params.toString()}` : base;
      const sheep = await apiService.getBackendResponse<Sheep[]>(url);
      return sheep;
    } catch (error) {
      console.error('Error fetching sheep by gender:', error);
      throw error;
    }
  }

  /**
   * Discard a sheep (mark as discarded without sale)
   */
  async discardSheep(id: string, reason: string): Promise<void> {
    try {
      await apiService.postBackendResponse<void>(API_ENDPOINTS.SHEEP_DISCARD(id), { reason });
    } catch (error) {
      console.error('Error discarding sheep:', error);
      throw error;
    }
  }

  /**
   * Sell a sheep (creates sale record and marks as discarded)
   */
  async sellSheep(id: string, saleData: AnimalSaleCreate): Promise<AnimalSale> {
    try {
      const sale = await apiService.postBackendResponse<AnimalSale>(API_ENDPOINTS.SHEEP_SELL(id), saleData);
      return sale;
    } catch (error) {
      console.error('Error selling sheep:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sheepService = new SheepService();
export default sheepService;

