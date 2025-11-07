import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { logger } from 'src/utils/logger';

/**
 * Rabbit-specific service - Only contains methods specific to rabbits
 * Generic methods should use animalService instead
 */
class RabbitSpecificService {
  /**
   * Create a litter of rabbits (multiple rabbits at once) and optionally register dead offspring
   */
  async createLitter(litterData: {
    mother_id: string;
    father_id?: string;
    birth_date: string;
    count: number;
    genders?: ('MALE' | 'FEMALE')[];
    name_prefix?: string;
    corral_id?: string;
    dead_count?: number;
    dead_notes?: string;
    dead_suspected_cause?: string;
  }): Promise<{
    litter: Array<{
      id: string;
      name: string;
      gender?: 'MALE' | 'FEMALE';
      birth_date?: string;
      mother_id?: string;
      father_id?: string;
    }>;
    count: number;
    mother_id: string;
    father_id?: string;
    dead_offspring?: {
      id: string;
      count: number;
      notes?: string;
      suspected_cause?: string;
    };
  }> {
    try {
      const response = await apiService.postBackendResponse<{
        litter: Array<{
          id: string;
          name: string;
          gender?: 'MALE' | 'FEMALE';
          birth_date?: string;
          mother_id?: string;
          father_id?: string;
        }>;
        count: number;
        mother_id: string;
        father_id?: string;
        dead_offspring?: {
          id: string;
          count: number;
          notes?: string;
          suspected_cause?: string;
        };
      }>(`${API_ENDPOINTS.RABBITS}/litter`, litterData);
      return response;
    } catch (error) {
      logger.error('Error creating litter', error);
      throw error;
    }
  }

  /**
   * Get dead offspring records for a specific mother
   */
  async getDeadOffspringByMother(motherId: string): Promise<Array<{
    id: string;
    mother_id: string;
    father_id?: string;
    birth_date: string;
    death_date: string;
    count: number;
    notes?: string;
    suspected_cause?: string;
    recorded_by: string;
    created_at: string;
  }>> {
    try {
      const records = await apiService.getBackendResponse<Array<{
        id: string;
        mother_id: string;
        father_id?: string;
        birth_date: string;
        death_date: string;
        count: number;
        notes?: string;
        suspected_cause?: string;
        recorded_by: string;
        created_at: string;
      }>>(`${API_ENDPOINTS.RABBITS}/dead-offspring/mother/${motherId}`);
      return records;
    } catch (error) {
      logger.error('Error fetching dead offspring', error);
      throw error;
    }
  }
}

// Export singleton instance
export const rabbitSpecificService = new RabbitSpecificService();
export default rabbitSpecificService;

