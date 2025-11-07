import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { BaseAnimal, BaseAnimalCreate, BaseAnimalUpdate, ApiResponse } from 'src/types/api';
import { ANIMAL_SPECIES, AnimalSpecies } from 'src/constants/animals';
import { logger } from 'src/utils/logger';

class AnimalService {
  /**
   * Get all animals of a specific species
   */
  async getAnimals(
    species: AnimalSpecies,
    sortBy?: 'asc' | 'desc',
    discarded?: boolean | null
  ): Promise<BaseAnimal[]> {
    try {
      const startTime = performance.now();
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', discarded.toString());
      }
      const queryString = params.toString();
      
      const endpoint = this.getSpeciesEndpoint(species);
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const animals = await apiService.getBackendResponse<BaseAnimal[]>(url);
      
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      logger.info(
        `⏱️ Frontend Performance - getAnimals(${species}): ${duration}ms, Count: ${animals.length}`
      );
      
      return animals;
    } catch (error) {
      logger.error(`Error fetching ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Get animal by ID
   */
  async getAnimalById(species: AnimalSpecies, id: string): Promise<BaseAnimal> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      const animal = await apiService.getBackendResponse<BaseAnimal>(`${endpoint}/${id}`);
      return animal;
    } catch (error) {
      logger.error(`Error fetching ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Get animals by gender
   */
  async getAnimalsByGender(
    species: AnimalSpecies,
    gender: 'MALE' | 'FEMALE',
    sortBy?: 'asc' | 'desc',
    discarded?: boolean | null
  ): Promise<BaseAnimal[]> {
    try {
      const startTime = performance.now();
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', discarded.toString());
      }
      const base = `${this.getSpeciesEndpoint(species)}/gender/${gender}`;
      const queryString = params.toString();
      const url = queryString ? `${base}?${queryString}` : base;
      const animals = await apiService.getBackendResponse<BaseAnimal[]>(url);
      
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      logger.info(
        `⏱️ Frontend Performance - getAnimalsByGender(${species}, ${gender}): ${duration}ms, Count: ${animals.length}`
      );
      
      return animals;
    } catch (error) {
      logger.error(`Error fetching ${species.toLowerCase()} by gender`, error);
      throw error;
    }
  }

  /**
   * Create a new animal
   */
  async createAnimal(species: AnimalSpecies, animalData: BaseAnimalCreate): Promise<BaseAnimal> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      const animal = await apiService.postBackendResponse<BaseAnimal>(`${endpoint}/add`, animalData);
      return animal;
    } catch (error) {
      logger.error(`Error creating ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Update animal by ID
   */
  async updateAnimal(species: AnimalSpecies, id: string, animalData: BaseAnimalUpdate): Promise<BaseAnimal> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      const animal = await apiService.putBackendResponse<BaseAnimal>(`${endpoint}/${id}`, animalData);
      return animal;
    } catch (error) {
      logger.error(`Error updating ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Delete animal by ID
   */
  async deleteAnimal(species: AnimalSpecies, id: string): Promise<void> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      await apiService.deleteBackendResponse<void>(`${endpoint}/${id}`);
    } catch (error) {
      logger.error(`Error deleting ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Discard an animal (mark as discarded without sale)
   */
  async discardAnimal(species: AnimalSpecies, id: string, reason: string): Promise<void> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      await apiService.postBackendResponse<void>(`${endpoint}/${id}/discard`, { reason });
    } catch (error) {
      logger.error(`Error discarding ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Sell an animal - creates sale record and marks as discarded
   */
  async sellAnimal(
    species: AnimalSpecies,
    id: string,
    saleData: {
      price: number;
      weight?: number;
      height?: number;
      notes?: string;
      sold_by: string;
      reason?: string;
    }
  ): Promise<{ id: string; animal_id: string; price: number; weight?: number; height?: number; notes?: string; sold_by: string }> {
    try {
      const endpoint = this.getSpeciesEndpoint(species);
      const sale = await apiService.postBackendResponse<{
        id: string;
        animal_id: string;
        price: number;
        weight?: number;
        height?: number;
        notes?: string;
        sold_by: string;
      }>(`${endpoint}/${id}/sell`, saleData);
      return sale;
    } catch (error) {
      logger.error(`Error selling ${species.toLowerCase()}`, error);
      throw error;
    }
  }

  /**
   * Slaughter a rabbit and store in freezer (inventory)
   * Only available for rabbits
   */
  async slaughterRabbit(id: string): Promise<BaseAnimal> {
    try {
      const rabbit = await apiService.postBackendResponse<BaseAnimal>(
        API_ENDPOINTS.RABBIT_SLAUGHTER(id),
        {}
      );
      return rabbit;
    } catch (error) {
      logger.error('Error slaughtering rabbit', error);
      throw error;
    }
  }

  /**
   * Get animals with full response (including message)
   */
  async getAnimalsWithMessage(
    species: AnimalSpecies,
    sortBy?: 'asc' | 'desc',
    discarded?: boolean | null
  ): Promise<ApiResponse<BaseAnimal[]>> {
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append('sort', sortBy);
      }
      if (discarded !== undefined && discarded !== null) {
        params.append('discarded', discarded.toString());
      }
      const queryString = params.toString();
      const endpoint = this.getSpeciesEndpoint(species);
      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const response = await apiService.getFullResponse<BaseAnimal[]>(url);
      return response;
    } catch (error) {
      logger.error(`Error fetching ${species.toLowerCase()} with message`, error);
      throw error;
    }
  }

  /**
   * Get the API endpoint for a specific species
   */
  private getSpeciesEndpoint(species: AnimalSpecies): string {
    switch (species) {
      case ANIMAL_SPECIES.RABBIT:
        return API_ENDPOINTS.RABBITS;
      case ANIMAL_SPECIES.COW:
        return API_ENDPOINTS.COWS;
      case ANIMAL_SPECIES.SHEEP:
        return API_ENDPOINTS.SHEEP;
      default:
        throw new Error(`Unknown species: ${species}`);
    }
  }
}

// Export singleton instance
export const animalService = new AnimalService();
export default animalService;

