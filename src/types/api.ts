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

// Generic Types
export type AnimalType = 'RABBIT' | 'COW' | 'SHEEP' | 'CHICKEN' | 'OTHER';
export type Gender = 'MALE' | 'FEMALE';
export type Role = 'admin' | 'user' | 'viewer' | 'trabajador';

// Base Animal interface - shared fields for all animals
export interface BaseAnimal {
  id: string;
  name: string;
  species?: AnimalType;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  discarded: boolean;
  discarded_reason?: string;
  user_id?: string;
  corral_id?: string;
  created_at: string;
  updated_at: string;
}

// Base Animal Create/Update interfaces
export interface BaseAnimalCreate {
  name: string;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  user_id?: string;
  corral_id?: string;
}

export interface BaseAnimalUpdate {
  name?: string;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  user_id?: string;
  corral_id?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  role?: Role;
}

// Rabbit Types
export interface Rabbit extends BaseAnimal {}

export interface RabbitCreate extends BaseAnimalCreate {}

export interface RabbitUpdate extends BaseAnimalUpdate {}

// Cow Types
export interface Cow extends BaseAnimal {}

export interface CowCreate extends BaseAnimalCreate {}

export interface CowUpdate extends BaseAnimalUpdate {}

// Sheep Types
export interface Sheep extends BaseAnimal {}

export interface SheepCreate extends BaseAnimalCreate {}

export interface SheepUpdate extends BaseAnimalUpdate {}

// Financial Module Types
export type ProductType = 'miel' | 'huevos' | 'leche' | 'otros';
export type ExpenseCategory = 'alimentacion' | 'medicamentos' | 'mantenimiento' | 'personal' | 'servicios' | 'equipos' | 'otros';

export interface ProductSale {
  id: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  customer_name?: string;
  notes?: string;
  sold_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProductSaleCreate {
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  sale_date: string;
  customer_name?: string;
  notes?: string;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
  vendor?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  category: ExpenseCategory;
  description: string;
  amount: number;
  expense_date: string;
  vendor?: string;
  notes?: string;
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

// Animal Sale Types - Generic for all animals
export interface AnimalSale {
  id: string;
  animal_id: string;
  animal_type?: AnimalType;
  price: number;
  weight?: number;
  height?: number;
  notes?: string;
  sold_by: string;
  created_at: string;
  updated_at: string;
}

export interface AnimalSaleCreate {
  price: number;
  weight?: number;
  height?: number;
  notes?: string;
  sold_by: string;
  reason?: string;
}

// Auth Types
export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
  role?: Role; // Role from database (admin, user, viewer)
}

export interface LoginUrlResponse {
  loginUrl: string;
}

export interface LogoutUrlResponse {
  logoutUrl: string;
}
