import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Rabbit } from '../types/api';

class RabbitService {
  /**
   * Get all rabbits
   */
  async getRabbits(): Promise<Rabbit[]> {
    try {
      const rabbits = await apiService.get<Rabbit[]>(API_ENDPOINTS.RABBITS);
      return rabbits;
    } catch (error) {
      console.error('Error fetching rabbits:', error);
      throw error;
    }
  }

  /**
   * Add a new rabbit
   */
  async addRabbit(rabbitData: Partial<Rabbit>): Promise<Rabbit> {
    try {
      const rabbit = await apiService.post<Rabbit>(API_ENDPOINTS.RABBITS_ADD, rabbitData);
      return rabbit;
    } catch (error) {
      console.error('Error adding rabbit:', error);
      throw error;
    }
  }

  /**
   * Update a rabbit
   */
  async updateRabbit(id: string, rabbitData: Partial<Rabbit>): Promise<Rabbit> {
    try {
      const rabbit = await apiService.put<Rabbit>(`${API_ENDPOINTS.RABBITS}/${id}`, rabbitData);
      return rabbit;
    } catch (error) {
      console.error('Error updating rabbit:', error);
      throw error;
    }
  }

  /**
   * Delete a rabbit
   */
  async deleteRabbit(id: string): Promise<{ message: string }> {
    try {
      const result = await apiService.delete<{ message: string }>(`${API_ENDPOINTS.RABBITS}/${id}`);
      return result;
    } catch (error) {
      console.error('Error deleting rabbit:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const rabbitService = new RabbitService();
export default rabbitService;
