import { NextRequest, NextResponse } from 'next/server';
import { Category, CategoryCreateRequest, CategoryResponse } from '@/entities/category';

// Mock data for categories
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const parentId = searchParams.get('parentId');
    const includeChildren = searchParams.get('includeChildren') === 'true';

    let filteredCategories = [...mockCategories];

    // Filter by parentId if specified
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        // Get root categories
        filteredCategories = filteredCategories.filter(cat => cat.parentId === null);
      } else {
        // Get children of specific parent
        filteredCategories = filteredCategories.filter(cat => cat.parentId === parentId);
      }
    }

    // Add children if requested
    if (includeChildren) {
      filteredCategories = filteredCategories.map(category => ({
        ...category,
        children: mockCategories.filter(cat => cat.parentId === category.id),
      }));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    const response: CategoryResponse = {
      categories: paginatedCategories,
      total: filteredCategories.length,
      page,
      limit,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CategoryCreateRequest = await request.json();

    // Generate slug from name
    const slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Determine level based on parent
    let level = 0;
    if (body.parentId) {
      const parent = mockCategories.find(cat => cat.id === body.parentId);
      level = parent ? parent.level + 1 : 0;
    }

    const newCategory: Category = {
      id: (mockCategories.length + 1).toString(),
      name: body.name,
      description: body.description,
      slug,
      parentId: body.parentId || null,
      level,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 1,
      imageUrl: body.imageUrl || null,
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productCount: 0,
    };

    mockCategories.push(newCategory);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}