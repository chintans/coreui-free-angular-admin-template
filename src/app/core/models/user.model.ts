export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  CONSULTANT = 'consultant',
  CLIENT = 'client'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

