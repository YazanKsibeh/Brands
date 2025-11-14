"use client";

/**
 * Global providers for LocalStyle application
 * Sets up Redux store and React Query client
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store/store';
import { initializeAuth } from '@/store/auth/auth-slice';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

/**
 * Auth initialization component
 * Handles rehydrating auth state from localStorage on app start
 */
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Initialize auth state from localStorage
    store.dispatch(initializeAuth());
  }, []);

  return <>{children}</>;
};

/**
 * Main providers component that wraps the application
 */
export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
          />
        </AuthInitializer>
      </QueryClientProvider>
    </Provider>
  );
};