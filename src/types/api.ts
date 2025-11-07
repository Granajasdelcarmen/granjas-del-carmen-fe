// API Response Types - Compatible with Backend
import { AnimalSpecies } from 'src/constants/animals';

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
export type AnimalType = AnimalSpecies | 'CHICKEN' | 'OTHER';
export type Gender = 'MALE' | 'FEMALE';
export type Role = 'admin' | 'user' | 'viewer' | 'trabajador';
export type AnimalOrigin = 'BORN' | 'PURCHASED';

// Parent animal info (minimal info for relationships)
export interface ParentAnimalInfo {
  id: string;
  name: string;
  species?: AnimalType;
}

// Child animal info (minimal info for relationships)
export interface ChildAnimalInfo {
  id: string;
  name: string;
  species?: AnimalType;
  gender?: Gender;
  birth_date?: string;
}

// Base Animal interface - shared fields for all animals
export interface BaseAnimal {
  id: string;
  name: string;
  species?: AnimalType;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  origin?: AnimalOrigin;
  mother_id?: string;
  mother?: ParentAnimalInfo;
  father_id?: string;
  father?: ParentAnimalInfo;
  purchase_date?: string;
  purchase_price?: number;
  purchase_vendor?: string;
  is_breeder?: boolean;
  discarded: boolean;
  discarded_reason?: string;
  slaughtered?: boolean;
  slaughtered_date?: string;
  in_freezer?: boolean;
  user_id?: string;
  corral_id?: string;
  children?: ChildAnimalInfo[];
  created_at: string;
  updated_at: string;
}

// Base Animal Create/Update interfaces
export interface BaseAnimalCreate {
  name: string;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  origin?: AnimalOrigin;
  mother_id?: string;
  father_id?: string;
  purchase_date?: string;
  purchase_price?: number;
  purchase_vendor?: string;
  is_breeder?: boolean;
  user_id?: string;
  corral_id?: string;
}

export interface BaseAnimalUpdate {
  name?: string;
  image?: string;
  birth_date?: string;
  gender?: Gender;
  origin?: AnimalOrigin;
  mother_id?: string;
  father_id?: string;
  purchase_date?: string;
  purchase_price?: number;
  purchase_vendor?: string;
  is_breeder?: boolean;
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

// Total Sale Type (consolidated product + animal sales)
export interface TotalSale {
  id: string;
  sale_type: 'product' | 'animal';
  // Product sale fields
  product_type?: ProductType;
  quantity?: number;
  unit_price?: number;
  customer_name?: string;
  // Animal sale fields
  animal_id?: string;
  animal_type?: AnimalType;
  animal_name?: string;
  price?: number;
  weight?: number;
  height?: number;
  // Common fields
  total_price: number;
  sale_date: string;
  notes?: string;
  sold_by: string;
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
  role?: Role; // Role from database (admin, user, viewer)
}

export interface LoginUrlResponse {
  loginUrl: string;
}

export interface LogoutUrlResponse {
  logoutUrl: string;
}

// Rabbit Litter Types
export interface RabbitLitterCreate {
  mother_id: string;
  father_id?: string;
  birth_date: string;
  count: number;
  genders?: Gender[];
  name_prefix?: string;
  corral_id?: string;
}

export interface RabbitLitterResponse {
  litter: Array<{
    id: string;
    name: string;
    gender?: Gender;
    birth_date?: string;
    mother_id?: string;
    father_id?: string;
  }>;
  count: number;
  mother_id: string;
  father_id?: string;
}

// Dead Offspring Types
export interface DeadOffspring {
  id: string;
  mother_id: string;
  father_id?: string;
  birth_date: string;
  death_date: string;
  species?: AnimalType;
  count: number;
  notes?: string;
  suspected_cause?: string;
  recorded_by: string;
  created_at: string;
}

export interface DeadOffspringCreate {
  mother_id: string;
  father_id?: string;
  birth_date: string;
  count: number;
  notes?: string;
  suspected_cause?: string;
  recorded_by: string;
}

// Alert Types
export type AlertStatus = 'PENDING' | 'ACKNOWLEDGED' | 'DONE' | 'EXPIRED';
export type AlertPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Alert {
  id: number;
  name: string;
  description?: string;
  init_date: string;
  max_date: string;
  status: AlertStatus;
  priority: AlertPriority;
  animal_type?: AnimalType;
  animal_id?: string;
  corral_id?: string;
  event_id?: number;
  declined_reason?: string;
  rabbit_ids?: string[]; // Lista de IDs de conejos para alertas agrupadas
  created_at: string;
  updated_at: string;
}

export interface AlertRabbit {
  id: string;
  name: string;
  birth_date?: string;
  gender?: Gender;
  slaughtered?: boolean;
  in_freezer?: boolean;
}

export interface DeclineAlertRequest {
  reason: string;
}

// Inventory Types
export type InventoryProductType = 
  | 'MEAT_RABBIT' 
  | 'MEAT_CHICKEN' 
  | 'MEAT_COW' 
  | 'MEAT_SHEEP' 
  | 'EGGS' 
  | 'MILK' 
  | 'CHEESE' 
  | 'BUTTER' 
  | 'WOOL' 
  | 'HONEY' 
  | 'WAX' 
  | 'OTHER';

export type InventoryUnit = 'KG' | 'GRAMS' | 'LITERS' | 'UNITS' | 'DOZENS';

export type InventoryStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'EXPIRED' | 'DISCARDED';

export type InventoryTransactionType = 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export interface InventoryProduct {
  id: string;
  product_type: InventoryProductType;
  product_name: string;
  quantity: number;
  unit: InventoryUnit;
  production_date: string;
  expiration_date?: string;
  location?: string;
  unit_price?: number;
  status: InventoryStatus;
  animal_id?: string;
  created_by: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  transaction_type: InventoryTransactionType;
  quantity: number;
  reason?: string;
  sale_id?: string;
  user_id: string;
  notes?: string;
  created_at: string;
}

export interface InventoryProductCreate {
  product_type: InventoryProductType;
  product_name: string;
  quantity: number;
  unit: InventoryUnit;
  production_date?: string;
  expiration_date?: string;
  location?: string;
  unit_price?: number;
  animal_id?: string;
  notes?: string;
  reason?: string;
}

export interface InventoryProductUpdate {
  product_name?: string;
  quantity?: number;
  unit_price?: number;
  location?: string;
  expiration_date?: string;
  notes?: string;
}

export interface SellProductRequest {
  quantity: number;
  sale_id?: string;
}
