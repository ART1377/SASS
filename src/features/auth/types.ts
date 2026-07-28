export type UserRole = 'ADMIN' | 'MANAGER' | 'MEMBER';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
