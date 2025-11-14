export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId: string | null;
  level: number;
  isActive: boolean;
  sortOrder: number;
  imageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  productCount: number;
  children?: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  description: string;
  parentId?: string | null;
  isActive?: boolean;
  sortOrder?: number;
  imageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export interface CategoryUpdateRequest extends Partial<CategoryCreateRequest> {
  id: string;
}

export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[];
  depth: number;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}