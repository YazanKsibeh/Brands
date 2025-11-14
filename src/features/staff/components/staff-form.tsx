'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  StaffProfile, 
  StaffCreateRequest, 
  StaffUpdateRequest,
  StaffRole,
  StaffStatus,
  getRoleDisplayName,
  canManageRole,
  ROLE_PERMISSIONS
} from '@/entities/staff';
import { useAppSelector } from '@/store/hooks';

const staffFormSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  role: z.enum(['admin', 'brand_owner', 'branch_manager', 'staff']),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  branchId: z.string().optional(),
  managerId: z.string().optional(),
  employeeId: z.string().optional(),
  hireDate: z.string().min(1, 'Hire date is required'),
  salary: z.number().min(0, 'Salary must be non-negative').optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).optional(),
  sendInviteEmail: z.boolean().optional(),
  // Address fields
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  // Emergency contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
  staff?: StaffProfile;
  onSubmit: (data: StaffCreateRequest | StaffUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function StaffForm({ staff, onSubmit, onCancel, isLoading }: StaffFormProps) {
  const { user } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      email: staff?.email || '',
      firstName: staff?.firstName || '',
      lastName: staff?.lastName || '',
      role: staff?.role || 'staff',
      phoneNumber: staff?.phoneNumber || '',
      department: staff?.department || '',
      position: staff?.position || '',
      branchId: staff?.branchId || '',
      managerId: staff?.manager?.id || '',
      employeeId: staff?.employeeId || '',
      hireDate: staff?.hireDate ? staff.hireDate.split('T')[0] : '',
      salary: staff?.salary || undefined,
      status: staff?.status || 'pending',
      sendInviteEmail: !staff, // Default to true for new staff
      // Address
      street: staff?.address?.street || '',
      city: staff?.address?.city || '',
      state: staff?.address?.state || '',
      zipCode: staff?.address?.zipCode || '',
      country: staff?.address?.country || '',
      // Emergency contact
      emergencyContactName: staff?.emergencyContact?.name || '',
      emergencyContactPhone: staff?.emergencyContact?.phoneNumber || '',
      emergencyContactRelationship: staff?.emergencyContact?.relationship || '',
    },
  });

  // Get roles that current user can assign
  const availableRoles = React.useMemo(() => {
    if (!user) return [];
    
    const roles: StaffRole[] = ['admin', 'brand_owner', 'branch_manager', 'staff'];
    return roles.filter(role => canManageRole(user.role as StaffRole, role));
  }, [user]);

  const selectedRole = watch('role');
  const selectedPermissions = ROLE_PERMISSIONS[selectedRole] || [];

  const onFormSubmit = async (data: StaffFormData) => {
    try {
      const formattedData = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        phoneNumber: data.phoneNumber || undefined,
        department: data.department || undefined,
        position: data.position || undefined,
        branchId: data.branchId || undefined,
        managerId: data.managerId || undefined,
        employeeId: data.employeeId || undefined,
        hireDate: data.hireDate,
        salary: data.salary,
        sendInviteEmail: data.sendInviteEmail,
      };

      if (staff) {
        const updateData: StaffUpdateRequest = {
          ...formattedData,
          id: staff.id,
          status: data.status,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
          },
          emergencyContact: {
            name: data.emergencyContactName,
            phoneNumber: data.emergencyContactPhone,
            relationship: data.emergencyContactRelationship,
          },
        };
        await onSubmit(updateData);
      } else {
        await onSubmit(formattedData as StaffCreateRequest);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter email address"
                disabled={!!staff} // Don't allow email changes for existing staff
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role and Employment */}
      <Card>
        <CardHeader>
          <CardTitle>Role & Employment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

            {staff && (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={watch('status')} 
                  onValueChange={(value: StaffStatus) => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                {...register('position')}
                placeholder="e.g., Sales Associate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="e.g., Sales, Operations"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                {...register('employeeId')}
                placeholder="EMP001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                {...register('hireDate')}
              />
              {errors.hireDate && (
                <p className="text-sm text-destructive">{errors.hireDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary ($)</Label>
              <Input
                id="salary"
                type="number"
                {...register('salary', { valueAsNumber: true })}
                placeholder="50000"
                min="0"
              />
              {errors.salary && (
                <p className="text-sm text-destructive">{errors.salary.message}</p>
              )}
            </div>
          </div>

          {/* Role Permissions Preview */}
          <div className="space-y-2">
            <Label>Role Permissions</Label>
            <div className="p-3 border rounded-md bg-muted/50">
              <p className="text-sm font-medium mb-2">{getRoleDisplayName(selectedRole)} can:</p>
              <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                {selectedPermissions.map((permission) => (
                  <div key={permission} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    {permission.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      {staff && (
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register('street')}
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="NY"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  placeholder="10001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('country')}
                  placeholder="USA"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contact */}
      {staff && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  {...register('emergencyContactName')}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  {...register('emergencyContactPhone')}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  {...register('emergencyContactRelationship')}
                  placeholder="Spouse, Parent, etc."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Settings */}
      {!staff && (
        <Card>
          <CardHeader>
            <CardTitle>Invitation Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={watch('sendInviteEmail')}
                onCheckedChange={(checked: boolean) => setValue('sendInviteEmail', checked)}
              />
              <Label className="text-sm">
                Send invitation email to staff member
              </Label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              The staff member will receive an email with instructions to set up their account.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || isSubmitting}
        >
          {(isLoading || isSubmitting) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {staff ? 'Update Staff Member' : 'Add Staff Member'}
        </Button>
      </div>
    </form>
  );
}