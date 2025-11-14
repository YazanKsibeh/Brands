'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Pencil, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Plus, 
  Search,
  Filter,
  UserCheck,
  UserX,
  Mail,
  Phone
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useGetStaff, 
  useDeleteStaffMember, 
  useActivateStaffMember, 
  useDeactivateStaffMember 
} from '@/features/staff/api/use-staff';
import { 
  StaffProfile, 
  StaffRole, 
  StaffStatus, 
  getRoleDisplayName, 
  getStatusDisplayName 
} from '@/entities/staff';
import { useAppSelector } from '@/store/hooks';
import { hasPermission } from '@/entities/staff';

interface StaffListProps {
  onEdit?: (staff: StaffProfile) => void;
  onDelete?: (staff: StaffProfile) => void;
}

export function StaffList({ onEdit, onDelete }: StaffListProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<StaffStatus | 'all'>('all');

  const { data, isLoading, error } = useGetStaff({
    page,
    limit: 10,
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const deleteStaff = useDeleteStaffMember();
  const activateStaff = useActivateStaffMember();
  const deactivateStaff = useDeactivateStaffMember();

  const canManageStaff = user && hasPermission(user.role as StaffRole, 'staff.edit');
  const canDeleteStaff = user && hasPermission(user.role as StaffRole, 'staff.delete');
  const canCreateStaff = user && hasPermission(user.role as StaffRole, 'staff.create');

  const handleDelete = async (staff: StaffProfile) => {
    if (window.confirm(`Are you sure you want to delete "${staff.name}"? This action cannot be undone.`)) {
      try {
        await deleteStaff.mutateAsync(staff.id);
        onDelete?.(staff);
      } catch (error) {
        console.error('Error deleting staff member:', error);
        alert('Failed to delete staff member. Please try again.');
      }
    }
  };

  const handleActivate = async (staff: StaffProfile) => {
    try {
      await activateStaff.mutateAsync(staff.id);
    } catch (error) {
      console.error('Error activating staff member:', error);
      alert('Failed to activate staff member. Please try again.');
    }
  };

  const handleDeactivate = async (staff: StaffProfile) => {
    if (window.confirm(`Are you sure you want to deactivate "${staff.name}"?`)) {
      try {
        await deactivateStaff.mutateAsync(staff.id);
      } catch (error) {
        console.error('Error deactivating staff member:', error);
        alert('Failed to deactivate staff member. Please try again.');
      }
    }
  };

  const getStatusBadgeVariant = (status: StaffStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'suspended':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const renderStaffAvatar = (staff: StaffProfile) => {
    if (staff.avatar) {
      return (
        <Image
          src={staff.avatar}
          alt={staff.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      );
    }
    
    return (
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-primary">
          {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load staff members</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const staff = data?.staff || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff Members ({data?.total || 0})</CardTitle>
        {canCreateStaff && (
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/staff/invites">
                <Mail className="h-4 w-4 mr-2" />
                Invites
              </Link>
            </Button>
            <Button asChild>
              <Link href="/staff/create">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Link>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search staff members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value: StaffRole | 'all') => setRoleFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="brand_owner">Brand Owner</SelectItem>
              <SelectItem value="branch_manager">Branch Manager</SelectItem>
              <SelectItem value="staff">Staff Member</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value: StaffStatus | 'all') => setStatusFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {staff.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No staff members found</p>
            {canCreateStaff && (
              <Button asChild>
                <Link href="/staff/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Add your first staff member
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {renderStaffAvatar(member)}
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        {member.employeeId && (
                          <div className="text-xs text-muted-foreground">ID: {member.employeeId}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{getRoleDisplayName(member.role)}</div>
                      {member.position && (
                        <div className="text-sm text-muted-foreground">{member.position}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{member.department || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{member.branchName || 'Head Office'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(member.status)}>
                      {getStatusDisplayName(member.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {member.isEmailVerified && (
                        <div title="Email verified">
                          <Mail className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                      {member.isPhoneVerified && (
                        <div title="Phone verified">
                          <Phone className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/staff/${member.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        {canManageStaff && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/staff/${member.id}/edit`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {member.status === 'active' ? (
                              <DropdownMenuItem 
                                onClick={() => handleDeactivate(member)}
                                disabled={deactivateStaff.isPending}
                              >
                                <UserX className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem 
                                onClick={() => handleActivate(member)}
                                disabled={activateStaff.isPending}
                              >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {canDeleteStaff && member.status !== 'active' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(member)}
                              className="text-destructive focus:text-destructive"
                              disabled={deleteStaff.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Pagination would go here */}
        {data && data.total > data.limit && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((data.page - 1) * data.limit) + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} staff members
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(data.total / data.limit)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}