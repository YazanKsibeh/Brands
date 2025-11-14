'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategory, useDeleteCategory } from '@/features/categories/api/use-categories';
import { toast } from 'sonner';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const { data: category, isLoading, error } = useGetCategory(categoryId);
  const deleteCategory = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;
    
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      try {
        await deleteCategory.mutateAsync(category.id);
        toast.success('Category deleted successfully');
        router.push('/categories');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/categories/${category.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={category.productCount > 0 || deleteCategory.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{category.description}</p>
              </div>

              {category.imageUrl && (
                <div>
                  <h3 className="font-medium mb-2">Category Image</h3>
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="rounded border object-cover"
                  />
                </div>
              )}

              {(category.metaTitle || category.metaDescription) && (
                <div>
                  <h3 className="font-medium mb-2">SEO Information</h3>
                  <div className="space-y-2">
                    {category.metaTitle && (
                      <div>
                        <p className="text-sm font-medium">Meta Title</p>
                        <p className="text-sm text-muted-foreground">{category.metaTitle}</p>
                      </div>
                    )}
                    {category.metaDescription && (
                      <div>
                        <p className="text-sm font-medium">Meta Description</p>
                        <p className="text-sm text-muted-foreground">{category.metaDescription}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {category.children && category.children.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Subcategories ({category.children.length})</CardTitle>
                <Button size="sm" asChild>
                  <Link href="/categories/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subcategory
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.children.map((child) => (
                    <Card key={child.id} className="p-4">
                      <div className="flex items-center gap-3">
                        {child.imageUrl ? (
                          <Image
                            src={child.imageUrl}
                            alt={child.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {child.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <Link 
                            href={`/categories/${child.id}`}
                            className="font-medium hover:underline"
                          >
                            {child.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {child.productCount} products
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium">Products</p>
                <p className="text-2xl font-bold">{category.productCount}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Level</p>
                <p className="text-muted-foreground">{category.level}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Sort Order</p>
                <p className="text-muted-foreground">{category.sortOrder}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-muted-foreground">
                  {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-muted-foreground">
                  {new Date(category.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}