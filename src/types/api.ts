// API Response Types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface Rabbit {
  id: string;
  name: string;
  image?: string;
  birth_date?: string;
  gender?: 'MALE' | 'FEMALE';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthUser {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  [key: string]: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LoginUrlResponse {
  loginUrl: string;
}

export interface LogoutUrlResponse {
  logoutUrl: string;
}
