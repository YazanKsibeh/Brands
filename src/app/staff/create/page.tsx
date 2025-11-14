'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { StaffForm } from '@/features/staff/components/staff-form';
import { useCreateStaffMember } from '@/features/staff/api/use-staff';
import { StaffCreateRequest } from '@/entities/staff';

export default function CreateStaffPage() {
  const router = useRouter();
  const createStaff = useCreateStaffMember();

  const handleSubmit = async (data: StaffCreateRequest) => {
    try {
      await createStaff.mutateAsync(data);
      toast.success('Staff member added successfully');
      router.push('/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
      toast.error('Failed to add staff member');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Staff Member</h1>
        <p className="text-muted-foreground">
          Add a new team member to your organization
        </p>
      </div>

      <StaffForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createStaff.isPending}
      />
    </div>
  );
}