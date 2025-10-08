export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'corretor';
  phone?: string;
  avatar?: string;
  active: boolean;
  createdAt: Date;
}

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'corretor';
  phone?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'corretor';
}
