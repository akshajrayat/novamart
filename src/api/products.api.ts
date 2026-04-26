import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Product, ProductsResponse, ProductFilters, Category } from '../types/product';

// ─── Demo data fallback when Firestore is empty ─────────────────────
const DEMO_CATEGORIES: Category[] = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and devices', _count: { products: 4 } },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', description: 'Trendy clothing and accessories', _count: { products: 3 } },
  { id: 'cat3', name: 'Books', slug: 'books', description: 'Bestsellers and new releases', _count: { products: 2 } },
  { id: 'cat4', name: 'Home & Living', slug: 'home-living', description: 'Furniture and decor', _count: { products: 3 } },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-noise-cancelling-headphones',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and frequent travelers.',
    price: 299.99, comparePrice: 349.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    category: DEMO_CATEGORIES[0], categoryId: 'cat1', stock: 45, rating: 4.8, reviewCount: 234, featured: true, active: true,
    createdAt: '2026-01-15', updatedAt: '2026-01-15',
  },
  {
    id: 'p2', name: 'Smart Watch Ultra', slug: 'smart-watch-ultra',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display. Water-resistant up to 100m.',
    price: 449.99, comparePrice: 499.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
    category: DEMO_CATEGORIES[0], categoryId: 'cat1', stock: 28, rating: 4.6, reviewCount: 189, featured: true, active: true,
    createdAt: '2026-01-16', updatedAt: '2026-01-16',
  },
  {
    id: 'p3', name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker',
    description: 'Compact and powerful Bluetooth speaker with 360° surround sound and 20-hour battery life. IPX7 waterproof rating.',
    price: 79.99, comparePrice: 99.99,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'],
    category: DEMO_CATEGORIES[0], categoryId: 'cat1', stock: 120, rating: 4.5, reviewCount: 456, featured: false, active: true,
    createdAt: '2026-01-17', updatedAt: '2026-01-17',
  },
  {
    id: 'p4', name: 'Mechanical Keyboard RGB', slug: 'mechanical-keyboard-rgb',
    description: 'Premium mechanical keyboard with customizable RGB backlighting, hot-swappable switches, and aluminum frame.',
    price: 159.99, comparePrice: 189.99,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'],
    category: DEMO_CATEGORIES[0], categoryId: 'cat1', stock: 65, rating: 4.7, reviewCount: 312, featured: true, active: true,
    createdAt: '2026-01-18', updatedAt: '2026-01-18',
  },
  {
    id: 'p5', name: 'Designer Leather Backpack', slug: 'designer-leather-backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment, multiple pockets, and a timeless design.',
    price: 189.99, comparePrice: 229.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    category: DEMO_CATEGORIES[1], categoryId: 'cat2', stock: 35, rating: 4.4, reviewCount: 98, featured: false, active: true,
    createdAt: '2026-01-19', updatedAt: '2026-01-19',
  },
  {
    id: 'p6', name: 'Running Sneakers Air', slug: 'running-sneakers-air',
    description: 'Lightweight running shoes with air cushioning technology, breathable mesh upper, and responsive foam sole.',
    price: 139.99, comparePrice: 169.99,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    category: DEMO_CATEGORIES[1], categoryId: 'cat2', stock: 80, rating: 4.6, reviewCount: 567, featured: true, active: true,
    createdAt: '2026-01-20', updatedAt: '2026-01-20',
  },
  {
    id: 'p7', name: 'Classic Aviator Sunglasses', slug: 'classic-aviator-sunglasses',
    description: 'Iconic aviator style sunglasses with UV400 protection, polarized lenses, and lightweight metal frame.',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'],
    category: DEMO_CATEGORIES[1], categoryId: 'cat2', stock: 150, rating: 4.3, reviewCount: 201, featured: false, active: true,
    createdAt: '2026-01-21', updatedAt: '2026-01-21',
  },
  {
    id: 'p8', name: 'The Art of Design Thinking', slug: 'the-art-of-design-thinking',
    description: 'An inspiring guide to creative problem-solving through design thinking methodology. Includes practical exercises and case studies.',
    price: 24.99, comparePrice: 32.99,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
    category: DEMO_CATEGORIES[2], categoryId: 'cat3', stock: 300, rating: 4.9, reviewCount: 1023, featured: true, active: true,
    createdAt: '2026-01-22', updatedAt: '2026-01-22',
  },
  {
    id: 'p9', name: 'Coding the Future', slug: 'coding-the-future',
    description: 'A comprehensive guide to modern web development, featuring the latest frameworks, tools, and best practices.',
    price: 34.99, comparePrice: 44.99,
    images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'],
    category: DEMO_CATEGORIES[2], categoryId: 'cat3', stock: 200, rating: 4.7, reviewCount: 567, featured: false, active: true,
    createdAt: '2026-01-23', updatedAt: '2026-01-23',
  },
  {
    id: 'p10', name: 'Minimalist Desk Lamp', slug: 'minimalist-desk-lamp',
    description: 'Elegant LED desk lamp with adjustable brightness, color temperature control, and wireless charging base.',
    price: 89.99, comparePrice: 109.99,
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600'],
    category: DEMO_CATEGORIES[3], categoryId: 'cat4', stock: 55, rating: 4.5, reviewCount: 156, featured: false, active: true,
    createdAt: '2026-01-24', updatedAt: '2026-01-24',
  },
  {
    id: 'p11', name: 'Ceramic Plant Pot Set', slug: 'ceramic-plant-pot-set',
    description: 'Set of 3 handmade ceramic plant pots in neutral tones. Perfect for indoor plants and succulents.',
    price: 49.99, comparePrice: 64.99,
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'],
    category: DEMO_CATEGORIES[3], categoryId: 'cat4', stock: 90, rating: 4.4, reviewCount: 89, featured: false, active: true,
    createdAt: '2026-01-25', updatedAt: '2026-01-25',
  },
  {
    id: 'p12', name: 'Scented Candle Collection', slug: 'scented-candle-collection',
    description: 'Luxury scented candle set with lavender, vanilla, and sandalwood fragrances. Hand-poured natural soy wax.',
    price: 39.99, comparePrice: 54.99,
    images: ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600'],
    category: DEMO_CATEGORIES[3], categoryId: 'cat4', stock: 110, rating: 4.6, reviewCount: 234, featured: true, active: true,
    createdAt: '2026-01-26', updatedAt: '2026-01-26',
  },
];

export const productsApi = {
  getProducts: async (filters?: ProductFilters): Promise<ProductsResponse> => {
    try {
      const productsRef = collection(db, 'products');
      const constraints: any[] = [where('active', '==', true)];

      // Category filter
      if (filters?.category) {
        constraints.push(where('categoryId', '==', filters.category));
      }

      // Featured filter
      if (filters?.featured === 'true') {
        constraints.push(where('featured', '==', true));
      }

      // Price filters
      if (filters?.minPrice) {
        constraints.push(where('price', '>=', parseFloat(filters.minPrice)));
      }
      if (filters?.maxPrice) {
        constraints.push(where('price', '<=', parseFloat(filters.maxPrice)));
      }

      // Sorting
      switch (filters?.sort) {
        case 'price_asc':
          constraints.push(orderBy('price', 'asc'));
          break;
        case 'price_desc':
          constraints.push(orderBy('price', 'desc'));
          break;
        case 'rating':
          constraints.push(orderBy('rating', 'desc'));
          break;
        case 'newest':
          constraints.push(orderBy('createdAt', 'desc'));
          break;
        default:
          constraints.push(orderBy('createdAt', 'desc'));
      }

      const pageSize = filters?.limit || 12;
      constraints.push(firestoreLimit(pageSize));

      const q = query(productsRef, ...constraints);
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Fall back to demo data
        return applyDemoFilters(filters);
      }

      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);

      return {
        products,
        pagination: {
          page: filters?.page || 1,
          limit: pageSize,
          total: products.length,
          totalPages: 1,
        },
      };
    } catch {
      // Fallback to demo data on any error
      return applyDemoFilters(filters);
    }
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
      }
    } catch {
      // Fall through to demo
    }

    // Fallback to demo data
    const demo = DEMO_PRODUCTS.find((p) => p.slug === slug);
    if (demo) return demo;
    throw new Error('Product not found');
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('featured', '==', true), where('active', '==', true), firestoreLimit(8));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product);
      }
    } catch {
      // Fall through to demo
    }

    return DEMO_PRODUCTS.filter((p) => p.featured);
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Category);
      }
    } catch {
      // Fall through to demo
    }

    return DEMO_CATEGORIES;
  },
};

// Apply filters to demo data locally
function applyDemoFilters(filters?: ProductFilters): ProductsResponse {
  let products = [...DEMO_PRODUCTS];

  if (filters?.search) {
    const term = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  if (filters?.category) {
    products = products.filter((p) => p.categoryId === filters.category);
  }

  if (filters?.featured === 'true') {
    products = products.filter((p) => p.featured);
  }

  if (filters?.minPrice) {
    products = products.filter((p) => p.price >= parseFloat(filters.minPrice!));
  }
  if (filters?.maxPrice) {
    products = products.filter((p) => p.price <= parseFloat(filters.maxPrice!));
  }

  switch (filters?.sort) {
    case 'price_asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 12;
  const start = (page - 1) * limit;
  const paginated = products.slice(start, start + limit);

  return {
    products: paginated,
    pagination: {
      page,
      limit,
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
    },
  };
}
