/**
 * Edit Product Page for LocalStyle Application
 * Allows users to edit existing products
 */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ProductForm } from '@/features/products/components/product-form';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCreateRequest, Product } from '@/entities/product';
import { apiClient } from '@/shared/api/api-client';
import { AlertCircle } from 'lucide-react';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const productId = params.id;

  // Fetch product data
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async (): Promise<Product> => {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    },
    retry: 2,
  });

  const handleSubmit = async (data: ProductCreateRequest) => {
    try {
      // Update product via API
      const response = await apiClient.put(`/products/${productId}`, data);
      
      // Show success message (you can add a toast notification here)
      console.log('Product updated successfully:', response.data);
      
      // Redirect to products page
      router.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      // Handle error (show error message/toast)
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Error Loading Product</h3>
                <p className="text-muted-foreground mt-1">
                  {error instanceof Error ? error.message : 'Failed to load product data'}
                </p>
              </div>
              <button
                onClick={() => router.push('/products')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-lg">Product Not Found</h3>
                <p className="text-muted-foreground mt-1">
                  The product you're looking for doesn't exist.
                </p>
              </div>
              <button
                onClick={() => router.push('/products')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}