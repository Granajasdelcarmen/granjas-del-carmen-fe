import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Rabbit, RabbitCreate, RabbitUpdate, ApiResponse } from 'src/types/api';

class RabbitService {
  /**
   * Get all rabbits
   */
  async getRabbits(sortBy?: 'asc' | 'desc', discarded?: boolean | null): Promise<Rabbit[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', discarded.toString());
      }
      const queryString = params.toString();
      const url = queryString ? `${API_ENDPOINTS.RABBITS}?${queryString}` : API_ENDPOINTS.RABBITS;
      const rabbits = await apiService.getBackendResponse<Rabbit[]>(url);
      return rabbits;
    } catch (error) {
      console.error('Error fetching rabbits:', error);
      throw error;
    }
  }

  /**
   * Get rabbit by ID
   */
  async getRabbitById(id: string): Promise<Rabbit> {
    try {
      const rabbit = await apiService.getBackendResponse<Rabbit>(API_ENDPOINTS.RABBIT_BY_ID(id));
      return rabbit;
    } catch (error) {
      console.error('Error fetching rabbit:', error);
      throw error;
    }
  }

  /**
   * Get rabbits by gender
   */
  async getRabbitsByGender(
    gender: 'MALE' | 'FEMALE', 
    sortBy?: 'asc' | 'desc',
    discarded?: boolean | null
  ): Promise<Rabbit[]> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', discarded.toString());
      }
      const base = API_ENDPOINTS.RABBITS_BY_GENDER(gender);
      const queryString = params.toString();
      const url = queryString ? `${base}?${queryString}` : base;
      const rabbits = await apiService.getBackendResponse<Rabbit[]>(url);
      return rabbits;
    } catch (error) {
      console.error('Error fetching rabbits by gender:', error);
      throw error;
    }
  }

  /**
   * Create a new rabbit
   */
  async createRabbit(rabbitData: RabbitCreate): Promise<Rabbit> {
    try {
      const rabbit = await apiService.postBackendResponse<Rabbit>(API_ENDPOINTS.RABBITS_ADD, rabbitData);
      return rabbit;
    } catch (error) {
      console.error('Error creating rabbit:', error);
      throw error;
    }
  }

  /**
   * Update rabbit by ID
   */
  async updateRabbit(id: string, rabbitData: RabbitUpdate): Promise<Rabbit> {
    try {
      const rabbit = await apiService.putBackendResponse<Rabbit>(API_ENDPOINTS.RABBIT_BY_ID(id), rabbitData);
      return rabbit;
    } catch (error) {
      console.error('Error updating rabbit:', error);
      throw error;
    }
  }

  /**
   * Delete rabbit by ID
   */
  async deleteRabbit(id: string): Promise<void> {
    try {
      await apiService.deleteBackendResponse<void>(API_ENDPOINTS.RABBIT_BY_ID(id));
    } catch (error) {
      console.error('Error deleting rabbit:', error);
      throw error;
    }
  }

  /**
   * Discard a rabbit (mark as discarded without sale)
   */
  async discardRabbit(id: string, reason: string): Promise<void> {
    try {
      await apiService.postBackendResponse<void>(API_ENDPOINTS.RABBIT_DISCARD(id), { reason });
    } catch (error) {
      console.error('Error discarding rabbit:', error);
      throw error;
    }
  }

  /**
   * Sell a rabbit - creates sale record and marks as discarded
   */
  async sellRabbit(id: string, saleData: { price: number; weight?: number; height?: number; notes?: string; sold_by: string; reason?: string }): Promise<{ id: string; animal_id: string; price: number; weight?: number; height?: number; notes?: string; sold_by: string }> {
    try {
      const sale = await apiService.postBackendResponse<{ id: string; animal_id: string; price: number; weight?: number; height?: number; notes?: string; sold_by: string }>(API_ENDPOINTS.RABBIT_SELL(id), saleData);
      return sale;
    } catch (error) {
      console.error('Error selling rabbit:', error);
      throw error;
    }
  }

  /**
   * Get rabbits with full response (including message)
   */
  async getRabbitsWithMessage(): Promise<ApiResponse<Rabbit[]>> {
    try {
      const response = await apiService.getFullResponse<Rabbit[]>(API_ENDPOINTS.RABBITS);
      return response;
    } catch (error) {
      console.error('Error fetching rabbits with message:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const rabbitService = new RabbitService();
export default rabbitService;
