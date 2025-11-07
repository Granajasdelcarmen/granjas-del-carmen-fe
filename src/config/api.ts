// Configuración de la API - Compatible con Backend Flask
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

// Debug: Ver qué URL está usando (solo en desarrollo)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Frontend API Config:', {
    API_URL,
    API_BASE_URL,
    'REACT_APP_API_URL from env': process.env.REACT_APP_API_URL,
    'REACT_APP_API_BASE_URL from env': process.env.REACT_APP_API_BASE_URL
  });
}

export const API_CONFIG = {
  BASE_URL: API_URL,
  API_BASE_URL: API_BASE_URL,
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
  RABBIT_SLAUGHTER: (id: string) => `/rabbits/${id}/slaughter`,
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
  TOTAL_SALES: '/finance/total-sales',
  EXPENSES: '/finance/expenses',
  EXPENSE_BY_ID: (id: string) => `/finance/expenses/${id}`,
  
  // Alert endpoints
  ALERTS: '/alerts',
  ALERT_COMPLETE: (id: number) => `/alerts/${id}/complete`,
  ALERT_DECLINE: (id: number) => `/alerts/${id}/decline`,
  ALERT_RABBITS: (id: number) => `/alerts/${id}/rabbits`,
  
  // Inventory Product endpoints
  INVENTORY_PRODUCTS: '/inventory-products',
  INVENTORY_PRODUCT_BY_ID: (id: string) => `/inventory-products/${id}`,
  INVENTORY_PRODUCT_ADD: '/inventory-products/add',
  INVENTORY_PRODUCT_SELL: (id: string) => `/inventory-products/${id}/sell`,
  INVENTORY_PRODUCT_TRANSACTIONS: (id: string) => `/inventory-products/${id}/transactions`,
  INVENTORY_PRODUCTS_EXPIRED: '/inventory-products/expired',
};
