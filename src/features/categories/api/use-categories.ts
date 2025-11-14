import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import { 
  Category, 
  CategoryResponse, 
  CategoryCreateRequest, 
  CategoryUpdateRequest 
} from '@/entities/category';

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// API Functions
export const categoryApi = {
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    parentId?: string | null;
    includeChildren?: boolean;
  }): Promise<CategoryResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.parentId !== undefined) {
      searchParams.set('parentId', params.parentId || 'null');
    }
    if (params?.includeChildren) {
      searchParams.set('includeChildren', 'true');
    }

    const response = await apiClient.get(`/categories?${searchParams.toString()}`);
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CategoryCreateRequest): Promise<Category> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  updateCategory: async (data: CategoryUpdateRequest): Promise<Category> => {
    const response = await apiClient.put(`/categories/${data.id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};

// Hooks
export function useGetCategories(params?: {
  page?: number;
  limit?: number;
  parentId?: string | null;
  includeChildren?: boolean;
}) {
  const queryKey = categoryKeys.list(JSON.stringify(params || {}));
  
  return useQuery({
    queryKey,
    queryFn: () => categoryApi.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.updateCategory,
    onSuccess: (data) => {
      // Update specific category in cache
      queryClient.setQueryData(categoryKeys.detail(data.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}