'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCreateCategory } from '@/features/categories/api/use-categories';
import { CategoryCreateRequest } from '@/entities/category';

export default function CreateCategoryPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();

  const handleSubmit = async (data: CategoryCreateRequest) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success('Category created successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
        <p className="text-muted-foreground">
          Add a new category to organize your products
        </p>
      </div>

      <CategoryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createCategory.isPending}
      />
    </div>
  );
}