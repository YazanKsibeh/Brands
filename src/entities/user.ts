/**
 * User entity definitions for the LocalStyle application
 * Defines core user types and authentication-related interfaces
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'brand_owner' | 'branch_manager' | 'staff';
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}