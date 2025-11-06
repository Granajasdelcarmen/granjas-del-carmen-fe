import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Cow, CowCreate, CowUpdate, ApiResponse, AnimalSale, AnimalSaleCreate } from 'src/types/api';

class CowService {

  /**
   * Get cow by ID
   */
  async getCowById(id: string): Promise<Cow> {
    try {
      const cow = await apiService.getBackendResponse<Cow>(API_ENDPOINTS.COW_BY_ID(id));
      return cow;
    } catch (error) {
      console.error('Error fetching cow:', error);
      throw error;
    }
  }


  /**
   * Create a new cow
   */
  async createCow(cowData: CowCreate): Promise<Cow> {
    try {
      const cow = await apiService.postBackendResponse<Cow>(API_ENDPOINTS.COWS_ADD, cowData);
      return cow;
    } catch (error) {
      console.error('Error creating cow:', error);
      throw error;
    }
  }

  /**
   * Update cow by ID
   */
  async updateCow(id: string, cowData: CowUpdate): Promise<Cow> {
    try {
      const cow = await apiService.putBackendResponse<Cow>(API_ENDPOINTS.COW_BY_ID(id), cowData);
      return cow;
    } catch (error) {
      console.error('Error updating cow:', error);
      throw error;
    }
  }

  /**
   * Delete cow by ID
   */
  async deleteCow(id: string): Promise<void> {
    try {
      await apiService.deleteBackendResponse<void>(API_ENDPOINTS.COW_BY_ID(id));
    } catch (error) {
      console.error('Error deleting cow:', error);
      throw error;
    }
  }

  /**
   * Get cows with full response (including message)
   */
  async getCowsWithMessage(): Promise<ApiResponse<Cow[]>> {
    try {
      const response = await apiService.getFullResponse<Cow[]>(API_ENDPOINTS.COWS);
      return response;
    } catch (error) {
      console.error('Error fetching cows with message:', error);
      throw error;
    }
  }

  /**
   * Get cows with discarded filter
   */
  async getCows(sortBy?: 'asc' | 'desc', discarded?: boolean | null): Promise<Cow[]> {
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
      const url = params.toString() ? `${API_ENDPOINTS.COWS}?${params.toString()}` : API_ENDPOINTS.COWS;
      const cows = await apiService.getBackendResponse<Cow[]>(url);
      return cows;
    } catch (error) {
      console.error('Error fetching cows:', error);
      throw error;
    }
  }

  /**
   * Get cows by gender with optional sort and discarded filter
   */
  async getCowsByGender(gender: 'MALE' | 'FEMALE', sortBy?: 'asc' | 'desc', discarded?: boolean | null): Promise<Cow[]> {
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
      const base = API_ENDPOINTS.COWS_BY_GENDER(gender);
      const url = params.toString() ? `${base}?${params.toString()}` : base;
      const cows = await apiService.getBackendResponse<Cow[]>(url);
      return cows;
    } catch (error) {
      console.error('Error fetching cows by gender:', error);
      throw error;
    }
  }

  /**
   * Discard a cow (mark as discarded without sale)
   */
  async discardCow(id: string, reason: string): Promise<void> {
    try {
      await apiService.postBackendResponse<void>(API_ENDPOINTS.COW_DISCARD(id), { reason });
    } catch (error) {
      console.error('Error discarding cow:', error);
      throw error;
    }
  }

  /**
   * Sell a cow (creates sale record and marks as discarded)
   */
  async sellCow(id: string, saleData: AnimalSaleCreate): Promise<AnimalSale> {
    try {
      const sale = await apiService.postBackendResponse<AnimalSale>(API_ENDPOINTS.COW_SELL(id), saleData);
      return sale;
    } catch (error) {
      console.error('Error selling cow:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const cowService = new CowService();
export default cowService;

