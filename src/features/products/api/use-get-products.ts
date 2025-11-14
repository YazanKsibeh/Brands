/**
 * React Query hook for fetching products from the LocalStyle API
 * Provides data fetching, caching, and state management for products
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import { Product } from '@/entities/product';

/**
 * Custom hook to fetch products using React Query
 * 
 * @returns {UseQueryResult} Query object containing data, loading states, and error information
 * - data: Product[] | undefined - Array of products or undefined while loading
 * - isLoading: boolean - True when the query is in loading state
 * - isError: boolean - True when the query has errored
 * - error: Error | null - Error object if the query failed
 * - refetch: function - Function to manually refetch the data
 * - isSuccess: boolean - True when the query has successfully loaded
 * - isFetching: boolean - True when the query is fetching (including background refetches)
 */
export function useGetProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      const response = await apiClient.get('/products');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh for 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes - cache time (formerly cacheTime)
    retry: 3,                 // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}