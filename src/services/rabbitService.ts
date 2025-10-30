import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { Rabbit, RabbitCreate, RabbitUpdate, ApiResponse } from 'src/types/api';

class RabbitService {
  /**
   * Get all rabbits
   */
  async getRabbits(sortBy?: 'asc' | 'desc'): Promise<Rabbit[]> {
    try {
      const url = sortBy
        ? `${API_ENDPOINTS.RABBITS}?sort_by=${encodeURIComponent(sortBy)}`
        : API_ENDPOINTS.RABBITS;
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
  async getRabbitsByGender(gender: 'MALE' | 'FEMALE'): Promise<Rabbit[]> {
    try {
      const rabbits = await apiService.getBackendResponse<Rabbit[]>(API_ENDPOINTS.RABBITS_BY_GENDER(gender));
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
