/**
 * Authentication async thunks for LocalStyle application
 * Handles login, logout, and token refresh operations
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/shared/api/api-client';
import { AuthResponse } from '@/entities/user';

interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Async thunk for user login
 */
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data as AuthResponse;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk for token refresh
 */
export const refreshToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const currentRefreshToken = state.auth.refreshToken;
      
      if (!currentRefreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken: currentRefreshToken,
      });
      
      return response.data.tokens;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Token refresh failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Async thunk for user logout
 */
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logoutUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const accessToken = state.auth.accessToken;
      
      if (accessToken) {
        // Attempt to logout on server (optional - continues even if it fails)
        try {
          await apiClient.post('/auth/logout');
        } catch (error) {
          // Ignore server logout errors and continue with client logout
          console.warn('Server logout failed, continuing with client logout');
        }
      }
      
      // Client-side logout always succeeds
      return;
    } catch (error: any) {
      // Even if something goes wrong, we should still logout locally
      return;
    }
  }
);