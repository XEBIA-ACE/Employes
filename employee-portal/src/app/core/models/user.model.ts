/**
 * User role definitions
 */
export type UserRole = 'admin' | 'hr_manager' | 'manager' | 'employee';

/**
 * Represents an authenticated user
 */
export interface User {
  id: string;
  employeeId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  roles: UserRole[];
  department: string;
  position: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

/**
 * Authentication credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Auth tokens returned from the API
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Login response from the API
 */
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
