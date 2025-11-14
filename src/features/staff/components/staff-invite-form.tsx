'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  StaffInviteRequest,
  StaffRole,
  getRoleDisplayName,
  canManageRole
} from '@/entities/staff';
import { useAppSelector } from '@/store/hooks';
import { useCreateStaffInvite } from '../api/use-staff';

const inviteFormSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  role: z.enum(['admin', 'brand_owner', 'branch_manager', 'staff']),
  position: z.string().optional(),
  department: z.string().optional(),
  branchId: z.string().optional(),
  managerId: z.string().optional(),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

interface StaffInviteFormProps {
  onSubmit?: (data: StaffInviteRequest) => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function StaffInviteForm({ onSubmit, onSuccess, onCancel, isLoading }: StaffInviteFormProps) {
  const { user } = useAppSelector((state) => state.auth);
  const createInviteMutation = useCreateStaffInvite();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      role: 'staff',
      position: '',
      department: '',
      branchId: '',
      managerId: '',
      message: '',
    },
  });

  // Get roles that current user can assign
  const availableRoles = React.useMemo(() => {
    if (!user) return [];
    
    const roles: StaffRole[] = ['admin', 'brand_owner', 'branch_manager', 'staff'];
    return roles.filter(role => canManageRole(user.role as StaffRole, role));
  }, [user]);

  const onFormSubmit = async (data: InviteFormData) => {
    try {
      const inviteData: StaffInviteRequest = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        position: data.position || undefined,
        department: data.department || undefined,
        branchId: data.branchId || undefined,
        managerId: data.managerId || undefined,
        message: data.message || undefined,
      };

      if (onSubmit) {
        await onSubmit(inviteData);
      } else {
        await createInviteMutation.mutateAsync(inviteData);
        onSuccess?.();
      }
      reset(); // Clear form on success
    } catch (error) {
      console.error('Error submitting invite:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Invite New Staff Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role and Position */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={watch('role')} 
                onValueChange={(value: StaffRole) => setValue('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleDisplayName(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                {...register('position')}
                placeholder="e.g., Sales Associate"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('department')}
              placeholder="e.g., Sales, Operations"
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Add a personal welcome message..."
              rows={3}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This message will be included in the invitation email.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading || isSubmitting || createInviteMutation.isPending}
            >
              {(isLoading || isSubmitting || createInviteMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}