'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StaffForm } from '@/features/staff/components/staff-form';
import { useGetStaffMember, useUpdateStaffMember } from '@/features/staff/api/use-staff';
import { StaffUpdateRequest } from '@/entities/staff';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;
  
  const { data: staff, isLoading, error } = useGetStaffMember(staffId);
  const updateStaff = useUpdateStaffMember();

  const handleSubmit = async (data: StaffUpdateRequest) => {
    try {
      await updateStaff.mutateAsync(data);
      toast.success('Staff member updated successfully');
      router.push('/staff');
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast.error('Failed to update staff member');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Staff Member</h1>
        <p className="text-muted-foreground">
          Update the details for "{staff.name}"
        </p>
      </div>

      <StaffForm
        staff={staff}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateStaff.isPending}
      />
    </div>
  );
}