import { apiService } from './api';
import { API_ENDPOINTS } from 'src/config/api';
import { AuthUser, LoginUrlResponse, LogoutUrlResponse } from 'src/types/api';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
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
      const response = await apiService.get<AuthUser>(API_ENDPOINTS.AUTH_ME);
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
      const logoutUrl = await this.getLogoutUrl();
      this.clearAuth();
      // Redirigir al usuario a Auth0 logout
      window.location.href = logoutUrl;
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
    return !!this.getToken();
  }

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Establecer token en localStorage
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
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
    localStorage.removeItem(this.TOKEN_KEY);
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
