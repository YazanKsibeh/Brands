/**
 * Create Product Page for LocalStyle Application
 * Allows users to create new products
 */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProductForm } from '@/features/products/components/product-form';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProductCreateRequest } from '@/entities/product';
import { apiClient } from '@/shared/api/api-client';

export default function CreateProductPage() {
  const router = useRouter();

  const handleSubmit = async (data: ProductCreateRequest) => {
    try {
      // Create product via API
      const response = await apiClient.post('/products', data);
      
      // Show success message (you can add a toast notification here)
      console.log('Product created successfully:', response.data);
      
      // Redirect to products page
      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      // Handle error (show error message/toast)
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/products');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </DashboardLayout>
  );
}