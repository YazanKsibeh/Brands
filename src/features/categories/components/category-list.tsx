'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Eye, MoreHorizontal, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useGetCategories, useDeleteCategory } from '@/features/categories/api/use-categories';
import { Category } from '@/entities/category';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export function CategoryList({ onEdit, onDelete }: CategoryListProps) {
  const { data, isLoading, error } = useGetCategories({
    limit: 50,
    includeChildren: true,
  });
  const deleteCategory = useDeleteCategory();

  const handleDelete = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      try {
        await deleteCategory.mutateAsync(category.id);
        onDelete?.(category);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const getIndentLevel = (level: number) => {
    return level * 20; // 20px per level
  };

  const renderCategoryName = (category: Category) => {
    const paddingLeft = getIndentLevel(category.level);
    
    return (
      <div 
        className="flex items-center gap-2" 
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {category.level > 0 && (
          <span className="text-muted-foreground">└─</span>
        )}
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={32}
            height={32}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <div className="font-medium">{category.name}</div>
          <div className="text-sm text-muted-foreground">/{category.slug}</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load categories</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categories = data?.categories || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories ({data?.total || 0})</CardTitle>
        <Button asChild>
          <Link href="/categories/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Button asChild>
              <Link href="/categories/create">
                <Plus className="h-4 w-4 mr-2" />
                Create your first category
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {renderCategoryName(category)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="text-sm line-clamp-2">{category.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? 'default' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{category.productCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{category.sortOrder}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/categories/${category.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEdit?.(category)}
                          asChild
                        >
                          <Link href={`/categories/${category.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(category)}
                          className="text-destructive focus:text-destructive"
                          disabled={category.productCount > 0 || deleteCategory.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}