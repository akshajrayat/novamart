export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: Category;
  categoryId: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  active: boolean;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'name';
  featured?: string;
}
