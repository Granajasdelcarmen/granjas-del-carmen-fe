import { apiService } from './api';
import { API_ENDPOINTS } from '@/config/api';
import { User } from '@/types/api';

class UserService {
  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const users = await apiService.get<User[]>(API_ENDPOINTS.USERS);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Seed a test user
   */
  async seedUser(): Promise<User> {
    try {
      const user = await apiService.get<User>(API_ENDPOINTS.USERS_SEED);
      return user;
    } catch (error) {
      console.error('Error seeding user:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
