/**
 * Staff entity definitions for LocalStyle application
 * Comprehensive staff management with role-based permissions
 */

import { User } from './user';

export type StaffRole = 'admin' | 'brand_owner' | 'branch_manager' | 'staff';

export type StaffStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export type StaffPermission = 
  | 'products.view' | 'products.create' | 'products.edit' | 'products.delete'
  | 'categories.view' | 'categories.create' | 'categories.edit' | 'categories.delete'
  | 'orders.view' | 'orders.create' | 'orders.edit' | 'orders.delete'
  | 'staff.view' | 'staff.create' | 'staff.edit' | 'staff.delete'
  | 'branches.view' | 'branches.create' | 'branches.edit' | 'branches.delete'
  | 'brand.view' | 'brand.edit'
  | 'reports.view' | 'reports.export'
  | 'settings.view' | 'settings.edit';

export interface StaffProfile extends User {
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  address: {
    street: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    country: string | null;
  };
  emergencyContact: {
    name: string | null;
    phoneNumber: string | null;
    relationship: string | null;
  };
  status: StaffStatus;
  department: string | null;
  position: string | null;
  branchId: string | null;
  branchName: string | null;
  manager: {
    id: string | null;
    name: string | null;
  };
  employeeId: string | null;
  hireDate: string;
  terminationDate: string | null;
  salary: number | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin: string | null;
  permissions: StaffPermission[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface StaffCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  phoneNumber?: string;
  department?: string;
  position?: string;
  branchId?: string;
  managerId?: string;
  employeeId?: string;
  hireDate: string;
  salary?: number;
  permissions?: StaffPermission[];
  sendInviteEmail?: boolean;
}

export interface StaffUpdateRequest extends Partial<StaffCreateRequest> {
  id: string;
  status?: StaffStatus;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name?: string;
    phoneNumber?: string;
    relationship?: string;
  };
  terminationDate?: string;
}

export interface StaffInviteRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  branchId?: string;
  managerId?: string;
  position?: string;
  department?: string;
  message?: string;
}

export interface StaffInvite {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  branchId: string | null;
  branchName: string | null;
  position: string | null;
  department: string | null;
  invitedBy: string; // Changed to string for simplicity
  message: string | null;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  sentAt: string; // Added missing field
  expiresAt: string;
  createdAt: string;
  acceptedAt: string | null;
}

export interface StaffListResponse {
  staff: StaffProfile[];
  total: number;
  page: number;
  limit: number;
  filters?: {
    role?: StaffRole;
    status?: StaffStatus;
    branchId?: string;
    department?: string;
  };
}

export interface StaffStatsResponse {
  totalStaff: number;
  activeStaff: number;
  pendingInvites: number;
  byRole: Record<StaffRole, number>;
  byStatus: Record<StaffStatus, number>;
  byBranch: Record<string, number>;
  recentHires: number; // Last 30 days
}

// Role hierarchy and permissions mapping
export const ROLE_HIERARCHY: Record<StaffRole, number> = {
  admin: 4,
  brand_owner: 3,
  branch_manager: 2,
  staff: 1,
};

export const ROLE_PERMISSIONS: Record<StaffRole, StaffPermission[]> = {
  admin: [
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
    'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
    'staff.view', 'staff.create', 'staff.edit', 'staff.delete',
    'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
    'brand.view', 'brand.edit',
    'reports.view', 'reports.export',
    'settings.view', 'settings.edit',
  ],
  brand_owner: [
    'products.view', 'products.create', 'products.edit', 'products.delete',
    'categories.view', 'categories.create', 'categories.edit', 'categories.delete',
    'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
    'staff.view', 'staff.create', 'staff.edit', 'staff.delete',
    'branches.view', 'branches.create', 'branches.edit', 'branches.delete',
    'brand.view', 'brand.edit',
    'reports.view', 'reports.export',
    'settings.view', 'settings.edit',
  ],
  branch_manager: [
    'products.view', 'products.create', 'products.edit',
    'categories.view',
    'orders.view', 'orders.create', 'orders.edit', 'orders.delete',
    'staff.view', 'staff.create', 'staff.edit',
    'branches.view',
    'reports.view',
    'settings.view',
  ],
  staff: [
    'products.view',
    'categories.view',
    'orders.view', 'orders.create', 'orders.edit',
    'reports.view',
  ],
};

// Utility functions for role and permission management
export function hasPermission(userRole: StaffRole, permission: StaffPermission): boolean {
  return ROLE_PERMISSIONS[userRole].includes(permission);
}

export function canManageRole(managerRole: StaffRole, targetRole: StaffRole): boolean {
  return ROLE_HIERARCHY[managerRole] > ROLE_HIERARCHY[targetRole];
}

export function getRoleDisplayName(role: StaffRole): string {
  const roleNames: Record<StaffRole, string> = {
    admin: 'Administrator',
    brand_owner: 'Brand Owner',
    branch_manager: 'Branch Manager',
    staff: 'Staff Member',
  };
  return roleNames[role];
}

export function getStatusDisplayName(status: StaffStatus): string {
  const statusNames: Record<StaffStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    suspended: 'Suspended',
  };
  return statusNames[status];
}