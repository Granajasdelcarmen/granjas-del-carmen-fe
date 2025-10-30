// Configuración de la API - Compatible con Backend Flask
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1',
  TIMEOUT: 10000, // 10 segundos
};

// Endpoints específicos - Compatible con Backend
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH_LOGIN_URL: '/auth/login-url',
  AUTH_LOGOUT_URL: '/auth/logout-url',
  AUTH_ME: '/auth/me',
  
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  
  // Rabbit endpoints
  RABBITS: '/rabbits',
  RABBITS_ADD: '/rabbits/add',
  RABBIT_BY_ID: (id: string) => `/rabbits/${id}`,
  RABBITS_BY_GENDER: (gender: string) => `/rabbits/gender/${gender}`,
  
  // Inventory endpoints (para futuro)
  INVENTORY: '/inventory',
  INVENTORY_BY_ID: (id: string) => `/inventory/${id}`,
  
  // Rabbit Sales endpoints (para futuro)
  RABBIT_SALES: '/rabbit-sales',
  RABBIT_SALES_BY_ID: (id: string) => `/rabbit-sales/${id}`,
};
