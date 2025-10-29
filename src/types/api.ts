// API Response Types - Compatible with Backend

// Base API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'admin' | 'user' | 'viewer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  role?: 'admin' | 'user' | 'viewer';
}

// Rabbit Types
export interface Rabbit {
  id: string;
  name: string;
  image?: string;
  birth_date?: string;
  gender?: 'MALE' | 'FEMALE';
  discarded: boolean;
  discarded_reason?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface RabbitCreate {
  name: string;
  image?: string;
  birth_date?: string;
  gender?: 'MALE' | 'FEMALE';
  user_id?: string;
}

export interface RabbitUpdate {
  name?: string;
  image?: string;
  birth_date?: string;
  gender?: 'MALE' | 'FEMALE';
  user_id?: string;
}

// Inventory Types
export interface Inventory {
  id: string;
  item: string;
  quantity: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface InventoryCreate {
  item: string;
  quantity: number;
}

// Rabbit Sales Types
export interface RabbitSales {
  id: string;
  rabbit_id: string;
  price: number;
  height: number;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export interface LoginUrlResponse {
  loginUrl: string;
}

export interface LogoutUrlResponse {
  logoutUrl: string;
}
