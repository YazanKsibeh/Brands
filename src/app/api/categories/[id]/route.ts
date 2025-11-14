import { NextRequest, NextResponse } from 'next/server';
import { Category, CategoryUpdateRequest } from '@/entities/category';

// This would normally come from a database
// For now, we'll import the same mock data (in a real app, this would be in a shared data store)
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Clothing',
    description: 'All types of clothing items',
    slug: 'clothing',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    metaTitle: 'Clothing Category',
    metaDescription: 'Browse our extensive collection of clothing items',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    productCount: 45,
  },
  {
    id: '2',
    name: 'Shirts',
    description: 'Casual and formal shirts',
    slug: 'shirts',
    parentId: '1',
    level: 1,
    isActive: true,
    sortOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
    metaTitle: 'Shirts Collection',
    metaDescription: 'Quality shirts for every occasion',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
    productCount: 15,
  },
  {
    id: '3',
    name: 'Dresses',
    description: 'Elegant dresses for all occasions',
    slug: 'dresses',
    parentId: '1',
    level: 1,
    isActive: true,
    sortOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    metaTitle: 'Dresses Collection',
    metaDescription: 'Beautiful dresses for every style',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    productCount: 20,
  },
  {
    id: '4',
    name: 'Accessories',
    description: 'Fashion accessories and jewelry',
    slug: 'accessories',
    parentId: null,
    level: 0,
    isActive: true,
    sortOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b',
    metaTitle: 'Accessories Category',
    metaDescription: 'Complete your look with our accessories',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    productCount: 30,
  },
  {
    id: '5',
    name: 'Bags',
    description: 'Handbags, backpacks, and more',
    slug: 'bags',
    parentId: '4',
    level: 1,
    isActive: true,
    sortOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    metaTitle: 'Bags Collection',
    metaDescription: 'Stylish bags for every need',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    productCount: 12,
  },
  {
    id: '6',
    name: 'Jewelry',
    description: 'Necklaces, earrings, and rings',
    slug: 'jewelry',
    parentId: '4',
    level: 1,
    isActive: true,
    sortOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338',
    metaTitle: 'Jewelry Collection',
    metaDescription: 'Elegant jewelry pieces',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    productCount: 18,
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const category = mockCategories.find(cat => cat.id === params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Add children
    const categoryWithChildren = {
      ...category,
      children: mockCategories.filter(cat => cat.parentId === category.id),
    };

    return NextResponse.json(categoryWithChildren);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: CategoryUpdateRequest = await request.json();
    const categoryIndex = mockCategories.findIndex(cat => cat.id === params.id);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const existingCategory = mockCategories[categoryIndex];

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (body.name && body.name !== existingCategory.name) {
      slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Determine new level if parent changed
    let level = existingCategory.level;
    if (body.parentId !== undefined && body.parentId !== existingCategory.parentId) {
      if (body.parentId === null) {
        level = 0;
      } else {
        const parent = mockCategories.find(cat => cat.id === body.parentId);
        level = parent ? parent.level + 1 : 0;
      }
    }

    const updatedCategory: Category = {
      ...existingCategory,
      ...body,
      slug,
      level,
      updatedAt: new Date().toISOString(),
    };

    mockCategories[categoryIndex] = updatedCategory;

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryIndex = mockCategories.findIndex(cat => cat.id === params.id);

    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has children
    const hasChildren = mockCategories.some(cat => cat.parentId === params.id);
    if (hasChildren) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    // Check if category has products (in a real app, you'd check the database)
    const category = mockCategories[categoryIndex];
    if (category.productCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with products' },
        { status: 400 }
      );
    }

    mockCategories.splice(categoryIndex, 1);

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}