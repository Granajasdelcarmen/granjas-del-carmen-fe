import { apiService } from './api';
import { API_ENDPOINTS, API_CONFIG } from 'src/config/api';
import { AuthUser, LoginUrlResponse, LogoutUrlResponse } from 'src/types/api';

class AuthService {
  private readonly USER_KEY = 'auth_user';

  /**
   * Obtener URL de login de Auth0
   */
  async getLoginUrl(): Promise<string> {
    const response = await apiService.get<LoginUrlResponse>(API_ENDPOINTS.AUTH_LOGIN_URL);
    return response.loginUrl;
  }

  /**
   * Obtener URL de logout de Auth0
   */
  async getLogoutUrl(): Promise<string> {
    const response = await apiService.get<LogoutUrlResponse>(API_ENDPOINTS.AUTH_LOGOUT_URL);
    return response.logoutUrl;
  }

  /**
   * Obtener información del usuario autenticado
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      // El backend devuelve directamente el usuario, no envuelto en ApiResponse
      const response = await apiService.get<AuthUser>(API_ENDPOINTS.AUTH_ME);
      // Si el backend responde con claves nulas, lo tratamos como no autenticado
      if (!response || !response.sub) {
        this.clearAuth();
        return null;
      }
      this.setUser(response);
      return response;
    } catch (error) {
      this.clearAuth();
      return null;
    }
  }

  /**
   * Iniciar proceso de login con Auth0
   */
  async login(): Promise<void> {
    const loginUrl = await this.getLoginUrl();
    // Redirigir al usuario a Auth0
    window.location.href = loginUrl;
  }

  /**
   * Cerrar sesión de Auth0
   */
  async logout(): Promise<void> {
    try {
      this.clearAuth();
      // Asegurar limpieza de la sesión del backend primero
      // Redirigimos directo a /logout del BE (éste a su vez redirige a Auth0 y retorna al FE)
      const apiBase = new URL(API_CONFIG.API_BASE_URL);
      const apiOrigin = `${apiBase.protocol}//${apiBase.hostname}${apiBase.port ? `:${apiBase.port}` : ''}`;
      window.location.href = `${apiOrigin}/logout`;
    } catch (error) {
      // Si falla, al menos limpiar el estado local
      this.clearAuth();
      window.location.reload();
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  /**
   * Obtener usuario del localStorage
   */
  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Establecer usuario en localStorage
   */
  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Limpiar datos de autenticación
   */
  clearAuth(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Manejar callback de Auth0 (después del redirect)
   * Este método se llama cuando el usuario regresa de Auth0
   */
  async handleAuthCallback(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      console.error('Error en callback de Auth0:', error);
      return false;
    }
  }
}

// Exportar una instancia singleton
export const authService = new AuthService();
export default authService;
