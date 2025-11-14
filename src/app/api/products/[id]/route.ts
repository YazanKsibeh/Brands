/**
 * Individual Product API routes - Handles CRUD operations for specific products
 * GET /api/products/[id] - Get product by ID
 * PUT /api/products/[id] - Update product by ID
 * DELETE /api/products/[id] - Delete product by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/entities/product';

// Mock product data (in real app, this would come from database)
const mockProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Classic Cotton T-Shirt',
    description: 'Premium 100% cotton t-shirt with comfortable fit and modern design. Perfect for casual wear.',
    price: 29.99,
    isPriceVisible: true,
    sku: 'LS-TEE-001',
    category: 'T-Shirts',
    colors: ['Black', 'White', 'Navy', 'Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    status: 'published',
    tags: ['casual', 'cotton', 'basic', 'unisex'],
    imageUrls: [
      'https://picsum.photos/seed/tshirt1a/300/400',
      'https://picsum.photos/seed/tshirt1b/300/400',
      'https://picsum.photos/seed/tshirt1c/300/400',
    ],
    dateAdded: '2024-01-15T10:30:00Z'
  },
  // Add other mock products here...
];

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/products/[id] - Get product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    // Find product by ID
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id] - Update product by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Find product index
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product (in real app, validate data with Zod schema)
    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    };

    // Update in mock array
    mockProducts[productIndex] = updatedProduct;

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id] - Delete product by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    
    // Find product index
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Remove product from array
    mockProducts.splice(productIndex, 1);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}