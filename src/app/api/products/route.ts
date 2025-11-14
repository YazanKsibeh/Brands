/**
/**
 * Products API route - Returns mock product data for LocalStyle application
 * GET /api/products - Returns array of 10 clothing/shoe products
 * POST /api/products - Creates a new product
 */

import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductCreateRequest } from '@/entities/product';

/**
 * Handle GET request to fetch products
 */
export async function GET(request: NextRequest) {
  try {
    // Mock products data
    const products: Product[] = [
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
          'https://picsum.photos/seed/tshirt1d/300/400',
          'https://picsum.photos/seed/tshirt1e/300/400'
        ],
        dateAdded: '2024-01-15T10:30:00Z'
      },
      {
        id: 'prod_002',
        name: 'Slim Fit Dark Wash Jeans',
        description: 'Modern slim-fit jeans crafted from premium denim with stretch comfort technology.',
        price: 89.99,
        isPriceVisible: true,
        sku: 'LS-JNS-002',
        category: 'Jeans',
        colors: ['Dark Blue', 'Black', 'Medium Blue'],
        sizes: ['28', '30', '32', '34', '36', '38'],
        status: 'published',
        tags: ['denim', 'slim-fit', 'premium', 'stretch'],
        imageUrls: [
          'https://picsum.photos/seed/jeans2a/300/400',
          'https://picsum.photos/seed/jeans2b/300/400',
          'https://picsum.photos/seed/jeans2c/300/400',
          'https://picsum.photos/seed/jeans2d/300/400',
          'https://picsum.photos/seed/jeans2e/300/400'
        ],
        dateAdded: '2024-01-18T14:45:00Z'
      },
      {
        id: 'prod_003',
        name: 'Urban Runner Sneakers',
        description: 'Lightweight athletic sneakers with responsive cushioning and breathable mesh upper.',
        price: 129.99,
        isPriceVisible: true,
        sku: 'LS-SNK-003',
        category: 'Sneakers',
        colors: ['White/Black', 'All Black', 'Gray/Blue'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        status: 'published',
        tags: ['athletic', 'running', 'comfortable', 'breathable'],
        imageUrls: [
          'https://picsum.photos/seed/sneaker3a/300/400',
          'https://picsum.photos/seed/sneaker3b/300/400',
          'https://picsum.photos/seed/sneaker3c/300/400',
          'https://picsum.photos/seed/sneaker3d/300/400',
          'https://picsum.photos/seed/sneaker3e/300/400'
        ],
        dateAdded: '2024-01-20T09:15:00Z'
      },
      {
        id: 'prod_004',
        name: 'Elegant Evening Dress',
        description: 'Sophisticated midi dress perfect for formal occasions with flowing silhouette and premium fabric.',
        price: 159.99,
        isPriceVisible: false,
        sku: 'LS-DRS-004',
        category: 'Dresses',
        colors: ['Black', 'Navy', 'Burgundy', 'Emerald'],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        status: 'published',
        tags: ['formal', 'elegant', 'midi', 'evening'],
        imageUrls: [
          'https://picsum.photos/seed/dress4a/300/400',
          'https://picsum.photos/seed/dress4b/300/400',
          'https://picsum.photos/seed/dress4c/300/400',
          'https://picsum.photos/seed/dress4d/300/400',
          'https://picsum.photos/seed/dress4e/300/400'
        ],
        dateAdded: '2024-01-22T16:20:00Z'
      },
      {
        id: 'prod_005',
        name: 'Merino Wool Sweater',
        description: 'Luxurious merino wool sweater with classic crew neck design. Soft, warm, and naturally odor-resistant.',
        price: 119.99,
        isPriceVisible: true,
        sku: 'LS-SWR-005',
        category: 'Sweaters',
        colors: ['Charcoal', 'Cream', 'Forest Green', 'Rust'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        status: 'published',
        tags: ['wool', 'luxury', 'warm', 'crew-neck'],
        imageUrls: [
          'https://picsum.photos/seed/sweater5a/300/400',
          'https://picsum.photos/seed/sweater5b/300/400',
          'https://picsum.photos/seed/sweater5c/300/400',
          'https://picsum.photos/seed/sweater5d/300/400',
          'https://picsum.photos/seed/sweater5e/300/400'
        ],
        dateAdded: '2024-01-25T11:10:00Z'
      },
      {
        id: 'prod_006',
        name: 'Professional Leather Boots',
        description: 'Handcrafted leather boots perfect for business casual wear. Durable construction with comfort insole.',
        price: 249.99,
        isPriceVisible: true,
        sku: 'LS-BTS-006',
        category: 'Boots',
        colors: ['Brown', 'Black', 'Tan'],
        sizes: ['7', '8', '9', '10', '11', '12', '13'],
        status: 'draft',
        tags: ['leather', 'professional', 'durable', 'handcrafted'],
        imageUrls: [
          'https://picsum.photos/seed/boots6a/300/400',
          'https://picsum.photos/seed/boots6b/300/400',
          'https://picsum.photos/seed/boots6c/300/400',
          'https://picsum.photos/seed/boots6d/300/400',
          'https://picsum.photos/seed/boots6e/300/400'
        ],
        dateAdded: '2024-01-28T13:45:00Z'
      },
      {
        id: 'prod_007',
        name: 'Summer Beach Shorts',
        description: 'Lightweight quick-dry shorts perfect for beach activities and summer adventures. Multiple pockets included.',
        price: 39.99,
        isPriceVisible: true,
        sku: 'LS-SHT-007',
        category: 'Shorts',
        colors: ['Navy', 'Olive', 'Coral', 'Sky Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        status: 'published',
        tags: ['summer', 'beach', 'quick-dry', 'lightweight'],
        imageUrls: [
          'https://picsum.photos/seed/shorts7a/300/400',
          'https://picsum.photos/seed/shorts7b/300/400',
          'https://picsum.photos/seed/shorts7c/300/400',
          'https://picsum.photos/seed/shorts7d/300/400',
          'https://picsum.photos/seed/shorts7e/300/400'
        ],
        dateAdded: '2024-02-01T08:30:00Z'
      },
      {
        id: 'prod_008',
        name: 'Designer Silk Blouse',
        description: 'Elegant silk blouse with modern cut and sophisticated draping. Perfect for office or special occasions.',
        price: 179.99,
        isPriceVisible: false,
        sku: 'LS-BLS-008',
        category: 'Blouses',
        colors: ['White', 'Blush Pink', 'Midnight Blue', 'Champagne'],
        sizes: ['XS', 'S', 'M', 'L'],
        status: 'published',
        tags: ['silk', 'designer', 'elegant', 'office-wear'],
        imageUrls: [
          'https://picsum.photos/seed/blouse8a/300/400',
          'https://picsum.photos/seed/blouse8b/300/400',
          'https://picsum.photos/seed/blouse8c/300/400',
          'https://picsum.photos/seed/blouse8d/300/400',
          'https://picsum.photos/seed/blouse8e/300/400'
        ],
        dateAdded: '2024-02-03T15:20:00Z'
      },
      {
        id: 'prod_009',
        name: 'Athletic Performance Jacket',
        description: 'High-performance athletic jacket with moisture-wicking technology and wind-resistant outer shell.',
        price: 199.99,
        isPriceVisible: true,
        sku: 'LS-JKT-009',
        category: 'Jackets',
        colors: ['Black/Red', 'Navy/White', 'Gray/Green'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        status: 'published',
        tags: ['athletic', 'performance', 'moisture-wicking', 'wind-resistant'],
        imageUrls: [
          'https://picsum.photos/seed/jacket9a/300/400',
          'https://picsum.photos/seed/jacket9b/300/400',
          'https://picsum.photos/seed/jacket9c/300/400',
          'https://picsum.photos/seed/jacket9d/300/400',
          'https://picsum.photos/seed/jacket9e/300/400'
        ],
        dateAdded: '2024-02-05T12:00:00Z'
      },
      {
        id: 'prod_010',
        name: 'Vintage Leather Handbag',
        description: 'Timeless leather handbag with vintage-inspired design. Multiple compartments and adjustable strap.',
        price: 299.99,
        isPriceVisible: true,
        sku: 'LS-BAG-010',
        category: 'Accessories',
        colors: ['Cognac', 'Black', 'Deep Brown'],
        sizes: ['One Size'],
        status: 'archived',
        tags: ['leather', 'vintage', 'handbag', 'accessories'],
        imageUrls: [
          'https://picsum.photos/seed/handbag10a/300/400',
          'https://picsum.photos/seed/handbag10b/300/400',
          'https://picsum.photos/seed/handbag10c/300/400',
          'https://picsum.photos/seed/handbag10d/300/400',
          'https://picsum.photos/seed/handbag10e/300/400'
        ],
        dateAdded: '2024-02-08T10:15:00Z'
      }
    ];

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * Handle POST request to create a new product
 */
export async function POST(request: NextRequest) {
  try {
    const productData: ProductCreateRequest = await request.json();
    
    // Generate new ID (in real app, this would be done by database)
    const newId = `prod_${String(products.length + 1).padStart(3, '0')}`;
    
    // Create new product with generated ID and current date
    const newProduct: Product = {
      ...productData,
      id: newId,
      dateAdded: new Date().toISOString(),
    };
    
    // Add to products array (in real app, save to database)
    products.push(newProduct);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}