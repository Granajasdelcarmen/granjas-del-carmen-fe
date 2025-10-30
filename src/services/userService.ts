import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { User, UserCreate, ApiResponse } from 'src/types/api';

class UserService {
  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const users = await apiService.getBackendResponse<User[]>(API_ENDPOINTS.USERS);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const user = await apiService.getBackendResponse<User>(API_ENDPOINTS.USER_BY_ID(id));
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserCreate): Promise<User> {
    try {
      const user = await apiService.postBackendResponse<User>(API_ENDPOINTS.USERS, userData);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, userData: Partial<UserCreate>): Promise<User> {
    try {
      const user = await apiService.putBackendResponse<User>(API_ENDPOINTS.USER_BY_ID(id), userData);
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await apiService.deleteBackendResponse<void>(API_ENDPOINTS.USER_BY_ID(id));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Dev seed removed: we now work only with real data

  /**
   * Get users with full response (including message)
   */
  async getUsersWithMessage(): Promise<ApiResponse<User[]>> {
    try {
      const response = await apiService.getFullResponse<User[]>(API_ENDPOINTS.USERS);
      return response;
    } catch (error) {
      console.error('Error fetching users with message:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
