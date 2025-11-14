/**
 * Configured Axios instance for API communication in LocalStyle application
 * Handles JWT authentication, token management, and common error scenarios
 * Compatible with both client-side and server-side execution in Next.js
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create the main Axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT authentication token
 * Automatically attaches Bearer token to all outgoing requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle common errors and authentication failures
 * Automatically handles 401 Unauthorized responses by clearing auth data
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Check if we're in a browser environment before accessing localStorage and window
      if (typeof window !== 'undefined') {
        // Clear authentication data from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;