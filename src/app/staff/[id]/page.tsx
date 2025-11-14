'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  DollarSign,
  Building,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useGetStaffMember, useDeleteStaffMember } from '@/features/staff/api/use-staff';
import { getRoleDisplayName, getStatusDisplayName, hasPermission } from '@/entities/staff';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: staff, isLoading, error } = useGetStaffMember(staffId);
  const deleteStaff = useDeleteStaffMember();

  const canEditStaff = user && hasPermission(user.role as any, 'staff.edit');
  const canDeleteStaff = user && hasPermission(user.role as any, 'staff.delete');

  const handleDelete = async () => {
    if (!staff) return;
    
    if (window.confirm(`Are you sure you want to delete "${staff.name}"? This action cannot be undone.`)) {
      try {
        await deleteStaff.mutateAsync(staff.id);
        toast.success('Staff member deleted successfully');
        router.push('/staff');
      } catch (error) {
        console.error('Error deleting staff member:', error);
        toast.error('Failed to delete staff member');
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !staff) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Member Not Found</h1>
          <p className="text-muted-foreground">
            The staff member you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            {staff.avatar ? (
              <Image
                src={staff.avatar}
                alt={staff.name}
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-15 h-15 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-primary">
                  {staff.firstName.charAt(0)}{staff.lastName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{staff.name}</h1>
              <p className="text-muted-foreground">{staff.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {canEditStaff && (
            <Button variant="outline" asChild>
              <Link href={`/staff/${staff.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}
          {canDeleteStaff && staff.status !== 'active' && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteStaff.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{staff.email}</p>
                    {staff.isEmailVerified && (
                      <Badge variant="outline" className="text-xs mt-1">Verified</Badge>
                    )}
                  </div>
                </div>

                {staff.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{staff.phoneNumber}</p>
                      {staff.isPhoneVerified && (
                        <Badge variant="outline" className="text-xs mt-1">Verified</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {staff.address && (staff.address.street || staff.address.city) && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <div className="text-sm text-muted-foreground">
                        {staff.address.street && <p>{staff.address.street}</p>}
                        <p>
                          {[staff.address.city, staff.address.state, staff.address.zipCode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        {staff.address.country && <p>{staff.address.country}</p>}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Employment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Branch</p>
                    <p className="text-sm text-muted-foreground">
                      {staff.branchName || 'Head Office'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">
                      {staff.department || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Hire Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(staff.hireDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {staff.salary && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Annual Salary</p>
                      <p className="text-sm text-muted-foreground">
                        ${staff.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {staff.manager.name && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Reports To</p>
                      <p className="text-sm text-muted-foreground">{staff.manager.name}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {staff.emergencyContact && staff.emergencyContact.name && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{staff.emergencyContact.name}</p>
                  {staff.emergencyContact.phoneNumber && (
                    <p className="text-sm text-muted-foreground">
                      {staff.emergencyContact.phoneNumber}
                    </p>
                  )}
                  {staff.emergencyContact.relationship && (
                    <p className="text-sm text-muted-foreground">
                      {staff.emergencyContact.relationship}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {getRoleDisplayName(staff.role)} can perform:
                </p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  {staff.permissions.map((permission) => (
                    <div key={permission} className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      {permission.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Status & Quick Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={getStatusBadgeVariant(staff.status)}>
                  {getStatusDisplayName(staff.status)}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">
                  {getRoleDisplayName(staff.role)}
                </p>
              </div>

              {staff.position && (
                <div>
                  <p className="text-sm font-medium">Position</p>
                  <p className="text-sm text-muted-foreground">{staff.position}</p>
                </div>
              )}

              {staff.employeeId && (
                <div>
                  <p className="text-sm font-medium">Employee ID</p>
                  <p className="text-sm text-muted-foreground">{staff.employeeId}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Join Date</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(staff.createdAt).toLocaleDateString()}
                </p>
              </div>

              {staff.lastLogin && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(staff.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}