'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGetCategories } from '@/features/categories/api/use-categories';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '@/entities/category';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().min(0, 'Sort order must be non-negative').max(9999, 'Sort order must be less than 10000'),
  imageUrl: z.string().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional().nullable().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional().nullable().or(z.literal('')),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: CategoryCreateRequest | CategoryUpdateRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CategoryForm({ category, onSubmit, onCancel, isLoading }: CategoryFormProps) {
  const [imagePreview, setImagePreview] = React.useState<string>(category?.imageUrl || '');
  
  // Fetch categories for parent selection (exclude current category and its descendants)
  const { data: categoriesData } = useGetCategories({ 
    limit: 100, 
    includeChildren: false 
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      parentId: category?.parentId || null,
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 1,
      imageUrl: category?.imageUrl || '',
      metaTitle: category?.metaTitle || '',
      metaDescription: category?.metaDescription || '',
    },
  });

  const watchedImageUrl = watch('imageUrl');

  React.useEffect(() => {
    if (watchedImageUrl && watchedImageUrl !== imagePreview) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl, imagePreview]);

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url);
    setImagePreview(url);
  };

  const clearImage = () => {
    setValue('imageUrl', '');
    setImagePreview('');
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    try {
      const formattedData = {
        ...data,
        parentId: data.parentId || null,
        imageUrl: data.imageUrl || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      };

      if (category) {
        await onSubmit({ ...formattedData, id: category.id } as CategoryUpdateRequest);
      } else {
        await onSubmit(formattedData as CategoryCreateRequest);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Filter out current category and its descendants for parent selection
  const availableParentCategories = React.useMemo(() => {
    if (!categoriesData?.categories) return [];
    
    if (!category) {
      // For new categories, show all categories
      return categoriesData.categories.filter(cat => cat.level < 2); // Limit depth
    }
    
    // For editing, exclude current category and its descendants
    return categoriesData.categories.filter(cat => 
      cat.id !== category.id && 
      !cat.parentId?.startsWith(category.id) &&
      cat.level < 2
    );
  }, [categoriesData?.categories, category]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter category name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select 
                value={watch('parentId') || ''} 
                onValueChange={(value: string) => setValue('parentId', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Parent (Root Category)</SelectItem>
                  {availableParentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter category description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register('sortOrder', { valueAsNumber: true })}
                placeholder="1"
                min="0"
                max="9999"
              />
              {errors.sortOrder && (
                <p className="text-sm text-destructive">{errors.sortOrder.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={watch('isActive')}
                  onCheckedChange={(checked: boolean) => setValue('isActive', checked)}
                />
                <Label className="text-sm">
                  {watch('isActive') ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Category Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                {...register('imageUrl')}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {imagePreview && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
            
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-32 h-32 object-cover rounded border"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                {...register('metaTitle')}
                placeholder="SEO title (max 60 characters)"
                maxLength={60}
              />
              {errors.metaTitle && (
                <p className="text-sm text-destructive">{errors.metaTitle.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('metaTitle')?.length || 0}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                {...register('metaDescription')}
                placeholder="SEO description (max 160 characters)"
                maxLength={160}
                rows={2}
              />
              {errors.metaDescription && (
                <p className="text-sm text-destructive">{errors.metaDescription.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {watch('metaDescription')?.length || 0}/160 characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || isSubmitting}
        >
          {(isLoading || isSubmitting) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}