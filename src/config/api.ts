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
  USER_ROLE_UPDATE: (id: string) => `/users/${id}/role`,
  
  // Rabbit endpoints
  RABBITS: '/rabbits',
  RABBITS_ADD: '/rabbits/add',
  RABBIT_BY_ID: (id: string) => `/rabbits/${id}`,
  RABBIT_DISCARD: (id: string) => `/rabbits/${id}/discard`,
  RABBIT_SELL: (id: string) => `/rabbits/${id}/sell`,
  RABBITS_BY_GENDER: (gender: string) => `/rabbits/gender/${gender}`,
  
  // Cow endpoints
  COWS: '/cows',
  COWS_ADD: '/cows/add',
  COW_BY_ID: (id: string) => `/cows/${id}`,
  COW_DISCARD: (id: string) => `/cows/${id}/discard`,
  COW_SELL: (id: string) => `/cows/${id}/sell`,
  COWS_BY_GENDER: (gender: string) => `/cows/gender/${gender}`,
  
  // Sheep endpoints
  SHEEP: '/sheep',
  SHEEP_ADD: '/sheep/add',
  SHEEP_BY_ID: (id: string) => `/sheep/${id}`,
  SHEEP_DISCARD: (id: string) => `/sheep/${id}/discard`,
  SHEEP_SELL: (id: string) => `/sheep/${id}/sell`,
  SHEEP_BY_GENDER: (gender: string) => `/sheep/gender/${gender}`,
  
  // Inventory endpoints (para futuro)
  INVENTORY: '/inventory',
  INVENTORY_BY_ID: (id: string) => `/inventory/${id}`,
  
  // Rabbit Sales endpoints (para futuro)
  RABBIT_SALES: '/rabbit-sales',
  RABBIT_SALES_BY_ID: (id: string) => `/rabbit-sales/${id}`,
  
  // Finance endpoints
  PRODUCT_SALES: '/finance/product-sales',
  PRODUCT_SALE_BY_ID: (id: string) => `/finance/product-sales/${id}`,
  EXPENSES: '/finance/expenses',
  EXPENSE_BY_ID: (id: string) => `/finance/expenses/${id}`,
};
