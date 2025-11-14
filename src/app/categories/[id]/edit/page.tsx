'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useGetCategory, useUpdateCategory } from '@/features/categories/api/use-categories';
import { CategoryUpdateRequest } from '@/entities/category';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const { data: category, isLoading, error } = useGetCategory(categoryId);
  const updateCategory = useUpdateCategory();

  const handleSubmit = async (data: CategoryUpdateRequest) => {
    try {
      await updateCategory.mutateAsync(data);
      toast.success('Category updated successfully');
      router.push('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
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

  if (error || !category) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Category Not Found</h1>
          <p className="text-muted-foreground">
            The category you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">
          Update the details for "{category.name}"
        </p>
      </div>

      <CategoryForm
        category={category}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateCategory.isPending}
      />
    </div>
  );
}