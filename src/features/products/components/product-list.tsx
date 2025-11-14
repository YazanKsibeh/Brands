/**
 * Product List Component - Displays products in a table format
 * Uses React Query for data fetching and shadcn/ui components for styling
 */

"use client";

import React from 'react';
import Link from 'next/link';
import { useGetProducts } from '../api/use-get-products';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react';

/**
 * Status badge component for product status display
 */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Price display component with visibility handling
 */
const PriceDisplay: React.FC<{ price: number; isPriceVisible: boolean }> = ({
  price,
  isPriceVisible,
}) => {
  if (!isPriceVisible) {
    return <span className="text-muted-foreground text-sm">Hidden</span>;
  }

  return (
    <span className="font-medium">
      ${price.toFixed(2)}
    </span>
  );
};

/**
 * Loading skeleton for the product table
 */
const ProductTableSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[90px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    ))}
  </div>
);

/**
 * Error display component
 */
const ErrorDisplay: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="flex items-center justify-center p-8 text-center">
    <div className="flex flex-col items-center space-y-3">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <div>
        <h3 className="font-semibold text-foreground">Error Loading Products</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {error?.message || 'An unexpected error occurred while fetching products.'}
        </p>
      </div>
    </div>
  </div>
);

/**
 * Main ProductList component
 */
export const ProductList: React.FC = () => {
  const { data: products, isLoading, isError, error } = useGetProducts();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 pb-2 border-b border-border">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <ProductTableSkeleton />
          </div>
        )}

        {isError && <ErrorDisplay error={error} />}

        {!isLoading && !isError && products && (
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Category</TableHead>
                  <TableHead className="font-semibold text-foreground">Price</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-foreground">SKU</TableHead>
                  <TableHead className="font-semibold text-foreground w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <p className="text-muted-foreground">No products found</p>
                        <p className="text-sm text-muted-foreground">
                          Start by adding your first product to the catalog.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.category}
                      </TableCell>
                      <TableCell>
                        <PriceDisplay
                          price={product.price}
                          isPriceVisible={product.isPriceVisible}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={product.status} />
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;