/**
 * Product entity definitions for the LocalStyle application
 * Defines product data structures and related types
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isPriceVisible: boolean;
  sku: string;
  category: string;
  colors: string[];
  sizes: string[];
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  imageUrls: string[];
  dateAdded: string;
}

export type ProductCreateRequest = Omit<Product, 'id' | 'dateAdded'>;