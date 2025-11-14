"use client";

/**
 * Product Form Component for LocalStyle Application
 * Handles product creation and editing with comprehensive validation
 */

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, ProductCreateRequest } from '@/entities/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  ImagePlus,
  X,
  Plus,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').min(3, 'Name must be at least 3 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  isPriceVisible: z.boolean(),
  sku: z.string().min(1, 'SKU is required').min(3, 'SKU must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  sizes: z.array(z.string()).min(1, 'At least one size is required'),
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string()),
  imageUrls: z.array(z.string().url('Invalid URL format')).max(5, 'Maximum 5 images allowed'),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductCreateRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// Pre-defined options
const categoryOptions = [
  'T-Shirts',
  'Jeans',
  'Sneakers',
  'Dresses',
  'Sweaters',
  'Boots',
  'Shorts',
  'Blouses',
  'Jackets',
  'Accessories',
];

const colorOptions = [
  'Black',
  'White',
  'Gray',
  'Navy',
  'Brown',
  'Beige',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Purple',
  'Orange',
];

const sizeOptions = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'One Size',
];

const tagOptions = [
  'casual',
  'formal',
  'sport',
  'vintage',
  'modern',
  'luxury',
  'basic',
  'premium',
  'comfortable',
  'trendy',
  'classic',
  'seasonal',
];

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>(product?.colors || []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(product?.sizes || []);
  const [selectedTags, setSelectedTags] = useState<string[]>(product?.tags || []);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.imageUrls || []);
  const [newImageUrl, setNewImageUrl] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      isPriceVisible: product?.isPriceVisible ?? true,
      sku: product?.sku || '',
      category: product?.category || '',
      colors: product?.colors || [],
      sizes: product?.sizes || [],
      status: product?.status || 'draft',
      tags: product?.tags || [],
      imageUrls: product?.imageUrls || [],
    },
  });

  const watchedStatus = watch('status');
  const watchedIsPriceVisible = watch('isPriceVisible');

  // Color management
  const handleColorToggle = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    setSelectedColors(newColors);
    setValue('colors', newColors);
  };

  // Size management
  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    setValue('sizes', newSizes);
  };

  // Tag management
  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  // Image management
  const handleAddImage = () => {
    if (newImageUrl && imageUrls.length < 5) {
      const newImages = [...imageUrls, newImageUrl];
      setImageUrls(newImages);
      setValue('imageUrls', newImages);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImages);
    setValue('imageUrls', newImages);
  };

  const onFormSubmit = async (data: ProductFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting product form:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'draft':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'archived':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {product ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-muted-foreground">
            {product ? 'Update product information' : 'Add a new product to your catalog'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>{product ? 'Update Product' : 'Create Product'}</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>Essential product details and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="required">Product Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter product name"
                  className={errors.name ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.name.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="required">SKU</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="e.g., LS-TSH-001"
                  className={errors.sku ? 'border-destructive' : ''}
                  disabled={isLoading}
                />
                {errors.sku && (
                  <p className="text-sm text-destructive flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.sku.message}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="required">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Describe your product..."
                rows={4}
                className={cn(
                  "w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  errors.description && "border-destructive"
                )}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-destructive flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.description.message}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="required">Category</Label>
                <Select onValueChange={(value: string) => setValue('category', value)} defaultValue={product?.category}>
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.category.message}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value: string) => setValue('status', value as 'draft' | 'published' | 'archived')} defaultValue={product?.status || 'draft'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getStatusColor('draft'))}>
                        Draft
                      </span>
                    </SelectItem>
                    <SelectItem value="published">
                      <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getStatusColor('published'))}>
                        Published
                      </span>
                    </SelectItem>
                    <SelectItem value="archived">
                      <span className={cn("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", getStatusColor('archived'))}>
                        Archived
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>Set product pricing and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
                className={errors.price ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.price && (
                <p className="text-sm text-destructive flex items-center space-x-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{errors.price.message}</span>
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPriceVisible"
                {...register('isPriceVisible')}
                className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                disabled={isLoading}
              />
              <Label htmlFor="isPriceVisible" className="flex items-center space-x-2 cursor-pointer">
                {watchedIsPriceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                <span>Show price to customers</span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
            <CardDescription>Select available colors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorToggle(color)}
                  className={cn(
                    "p-2 rounded-md text-xs border transition-colors",
                    selectedColors.includes(color)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                  disabled={isLoading}
                >
                  {color}
                </button>
              ))}
            </div>
            {errors.colors && (
              <p className="text-sm text-destructive mt-2 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.colors.message}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <CardDescription>Select available sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={cn(
                    "p-2 rounded-md text-xs border transition-colors",
                    selectedSizes.includes(size)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                  disabled={isLoading}
                >
                  {size}
                </button>
              ))}
            </div>
            {errors.sizes && (
              <p className="text-sm text-destructive mt-2 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.sizes.message}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Add relevant tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {tagOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={cn(
                    "p-2 rounded-md text-xs border transition-colors",
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                  disabled={isLoading}
                >
                  {tag}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImagePlus className="h-5 w-5" />
              <span>Product Images</span>
            </CardTitle>
            <CardDescription>Add up to 5 product images (URLs)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Image URL */}
            <div className="flex space-x-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
                disabled={isLoading || imageUrls.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={!newImageUrl || imageUrls.length >= 5 || isLoading}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Image List */}
            {imageUrls.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center text-muted-foreground">
                        <AlertCircle className="h-8 w-8" />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {errors.imageUrls && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.imageUrls.message}</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  );
};