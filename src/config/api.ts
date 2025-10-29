// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: 10000, // 10 segundos
};

// Endpoints específicos
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN_URL: '/auth/login-url',
  AUTH_LOGOUT_URL: '/auth/logout-url',
  AUTH_ME: '/auth/me',
  
  // User endpoints
  USERS: '/users',
  USERS_SEED: '/users/seed',
  
  // Rabbit endpoints
  RABBITS: '/rabbits',
  RABBITS_ADD: '/rabbits/add',
};
