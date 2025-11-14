/**
 * Brand API route - Returns brand data for LocalStyle application
 * GET /api/brand - Returns brand information for the current brand
 */

import { NextResponse } from 'next/server';
import { Brand } from '@/entities/brand';

/**
 * Handle GET request to fetch brand data
 * Returns static brand information for Nova Style fashion brand
 */
export async function GET() {
  try {
    // Static brand data that matches the Brand interface
    const brandData: Brand = {
      id: 'brand_001',
      name: 'Nova Style',
      logoUrl: 'https://picsum.photos/seed/novastyle-logo/300/300',
      bio: 'Nova Style is a contemporary fashion brand that combines modern aesthetics with timeless elegance. Founded in 2020, we specialize in creating premium clothing and accessories that empower individuals to express their unique style. Our collections feature carefully curated pieces made from sustainable materials, blending comfort with sophisticated design. From casual everyday wear to elegant evening attire, Nova Style offers versatile fashion solutions for the modern lifestyle.',
      contactInfo: {
        email: 'contact@novastyle.com',
        phone: '+1 (555) 123-4567',
        website: 'https://www.novastyle.com'
      }
    };

    return NextResponse.json(brandData, { status: 200 });
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand data' },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch brand data.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch brand data.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET to fetch brand data.' },
    { status: 405 }
  );
}