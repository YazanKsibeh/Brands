import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/api-client';
import { 
  StaffProfile, 
  StaffListResponse, 
  StaffCreateRequest, 
  StaffUpdateRequest,
  StaffStatsResponse,
  StaffRole,
  StaffStatus,
  StaffInvite,
  StaffInviteRequest
} from '@/entities/staff';

// Query Keys
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: string) => [...staffKeys.lists(), { filters }] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  stats: () => [...staffKeys.all, 'stats'] as const,
  invites: () => [...staffKeys.all, 'invites'] as const,
  invite: (id: string) => [...staffKeys.invites(), id] as const,
};

// API Functions
export const staffApi = {
  getStaff: async (params?: {
    page?: number;
    limit?: number;
    role?: StaffRole;
    status?: StaffStatus;
    branchId?: string;
    department?: string;
    search?: string;
  }): Promise<StaffListResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.role) searchParams.set('role', params.role);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.branchId) searchParams.set('branchId', params.branchId);
    if (params?.department) searchParams.set('department', params.department);
    if (params?.search) searchParams.set('search', params.search);

    const response = await apiClient.get(`/staff?${searchParams.toString()}`);
    return response.data;
  },

  getStaffMember: async (id: string): Promise<StaffProfile> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data;
  },

  getStaffStats: async (): Promise<StaffStatsResponse> => {
    const response = await apiClient.get('/staff/stats');
    return response.data;
  },

  createStaffMember: async (data: StaffCreateRequest): Promise<StaffProfile> => {
    const response = await apiClient.post('/staff', data);
    return response.data;
  },

  updateStaffMember: async (data: StaffUpdateRequest): Promise<StaffProfile> => {
    const response = await apiClient.put(`/staff/${data.id}`, data);
    return response.data;
  },

  deleteStaffMember: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },

  deactivateStaffMember: async (id: string): Promise<StaffProfile> => {
    const response = await apiClient.put(`/staff/${id}`, { status: 'inactive' });
    return response.data;
  },

  activateStaffMember: async (id: string): Promise<StaffProfile> => {
    const response = await apiClient.put(`/staff/${id}`, { status: 'active' });
    return response.data;
  },

  // Staff Invite API functions
  getStaffInvites: async (): Promise<StaffInvite[]> => {
    const response = await apiClient.get('/staff/invites');
    return response.data;
  },

  getStaffInvite: async (id: string): Promise<StaffInvite> => {
    const response = await apiClient.get(`/staff/invites/${id}`);
    return response.data;
  },

  createStaffInvite: async (data: StaffInviteRequest): Promise<StaffInvite> => {
    const response = await apiClient.post('/staff/invites', data);
    return response.data;
  },

  resendStaffInvite: async (id: string): Promise<StaffInvite> => {
    const response = await apiClient.put(`/staff/invites/${id}`, { action: 'resend' });
    return response.data;
  },

  cancelStaffInvite: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/invites/${id}`);
  },
};

// Hooks
export function useGetStaff(params?: {
  page?: number;
  limit?: number;
  role?: StaffRole;
  status?: StaffStatus;
  branchId?: string;
  department?: string;
  search?: string;
}) {
  const queryKey = staffKeys.list(JSON.stringify(params || {}));
  
  return useQuery({
    queryKey,
    queryFn: () => staffApi.getStaff(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetStaffMember(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getStaffMember(id),
    enabled: !!id,
  });
}

export function useGetStaffStats() {
  return useQuery({
    queryKey: staffKeys.stats(),
    queryFn: staffApi.getStaffStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCreateStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.createStaffMember,
    onSuccess: () => {
      // Invalidate and refetch staff lists and stats
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
    },
  });
}

export function useUpdateStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.updateStaffMember,
    onSuccess: (data) => {
      // Update specific staff member in cache
      queryClient.setQueryData(staffKeys.detail(data.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
    },
  });
}

export function useDeleteStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.deleteStaffMember,
    onSuccess: () => {
      // Invalidate and refetch staff data
      queryClient.invalidateQueries({ queryKey: staffKeys.all });
    },
  });
}

export function useDeactivateStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.deactivateStaffMember,
    onSuccess: (data) => {
      // Update staff member in cache
      queryClient.setQueryData(staffKeys.detail(data.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
    },
  });
}

export function useActivateStaffMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.activateStaffMember,
    onSuccess: (data) => {
      // Update staff member in cache
      queryClient.setQueryData(staffKeys.detail(data.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.stats() });
    },
  });
}

// Staff Invite Hooks
export function useGetStaffInvites() {
  return useQuery({
    queryKey: staffKeys.invites(),
    queryFn: staffApi.getStaffInvites,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetStaffInvite(id: string) {
  return useQuery({
    queryKey: staffKeys.invite(id),
    queryFn: () => staffApi.getStaffInvite(id),
    enabled: !!id,
  });
}

export function useCreateStaffInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.createStaffInvite,
    onSuccess: () => {
      // Invalidate and refetch invites
      queryClient.invalidateQueries({ queryKey: staffKeys.invites() });
    },
  });
}

export function useResendStaffInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.resendStaffInvite,
    onSuccess: (data) => {
      // Update specific invite in cache
      queryClient.setQueryData(staffKeys.invite(data.id), data);
      // Invalidate lists to refetch
      queryClient.invalidateQueries({ queryKey: staffKeys.invites() });
    },
  });
}

export function useCancelStaffInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.cancelStaffInvite,
    onSuccess: () => {
      // Invalidate and refetch invites
      queryClient.invalidateQueries({ queryKey: staffKeys.invites() });
    },
  });
}