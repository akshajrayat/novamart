import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import { productsApi } from '../api/products.api';
import ProductCard from '../components/product/ProductCard';
import { useDebounce } from '../hooks/useDebounce';
import type { Product, Category, Pagination } from '../types/product';

// ─── Demo data (same products from Home) ────────────────────────────
const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', _count: { products: 6 } },
  { id: '2', name: 'Clothing', slug: 'clothing', _count: { products: 5 } },
  { id: '3', name: 'Home & Living', slug: 'home-living', _count: { products: 4 } },
  { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors', _count: { products: 3 } },
  { id: '5', name: 'Books', slug: 'books', _count: { products: 3 } },
];

const ALL_DEMO_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-noise-cancelling-headphones', description: '', price: 299.99, comparePrice: 349.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 45, rating: 4.7, reviewCount: 128, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p2', name: 'Ultra-Slim Laptop Pro 16"', slug: 'ultra-slim-laptop-pro-16', description: '', price: 1499.99, comparePrice: 1699.99, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 20, rating: 4.9, reviewCount: 256, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p3', name: 'Smart Watch Series X', slug: 'smart-watch-series-x', description: '', price: 399.99, comparePrice: 449.99, images: ['https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 60, rating: 4.5, reviewCount: 89, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p9', name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: '', price: 79.99, comparePrice: 99.99, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 100, rating: 4.3, reviewCount: 67, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p10', name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', description: '', price: 149.99, images: ['https://images.unsplash.com/photo-1511467687858-23d96c529e0b?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 75, rating: 4.6, reviewCount: 42, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p11', name: '4K Webcam Pro', slug: '4k-webcam-pro', description: '', price: 129.99, comparePrice: 159.99, images: ['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600'], category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1', stock: 35, rating: 4.4, reviewCount: 31, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p4', name: 'Premium Cotton Hoodie', slug: 'premium-cotton-hoodie', description: '', price: 89.99, comparePrice: 110.00, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2', stock: 120, rating: 4.8, reviewCount: 203, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p5', name: 'Classic Leather Jacket', slug: 'classic-leather-jacket', description: '', price: 249.99, comparePrice: 299.99, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2', stock: 25, rating: 4.6, reviewCount: 78, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p12', name: 'Slim Fit Denim Jeans', slug: 'slim-fit-denim-jeans', description: '', price: 69.99, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'], category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2', stock: 200, rating: 4.4, reviewCount: 156, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p6', name: 'Running Sneakers Air', slug: 'running-sneakers-air', description: '', price: 139.99, comparePrice: 169.99, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2', stock: 80, rating: 4.7, reviewCount: 312, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p13', name: 'Cashmere Scarf', slug: 'cashmere-scarf', description: '', price: 59.99, images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600'], category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2', stock: 90, rating: 4.5, reviewCount: 45, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p14', name: 'Minimalist Desk Lamp', slug: 'minimalist-desk-lamp', description: '', price: 89.99, comparePrice: 109.99, images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'], category: { id: '3', name: 'Home & Living', slug: 'home-living' }, categoryId: '3', stock: 55, rating: 4.6, reviewCount: 67, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p7', name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair', description: '', price: 449.99, comparePrice: 549.99, images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'], category: { id: '3', name: 'Home & Living', slug: 'home-living' }, categoryId: '3', stock: 15, rating: 4.7, reviewCount: 183, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p15', name: 'Luxury Scented Candle Collection', slug: 'luxury-scented-candle-collection', description: '', price: 44.99, comparePrice: 59.99, images: ['https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600'], category: { id: '3', name: 'Home & Living', slug: 'home-living' }, categoryId: '3', stock: 70, rating: 4.8, reviewCount: 94, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p16', name: 'Yoga Mat Premium', slug: 'yoga-mat-premium', description: '', price: 39.99, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'], category: { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors' }, categoryId: '4', stock: 150, rating: 4.5, reviewCount: 76, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p17', name: 'Insulated Water Bottle', slug: 'insulated-water-bottle', description: '', price: 34.99, comparePrice: 44.99, images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'], category: { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors' }, categoryId: '4', stock: 200, rating: 4.6, reviewCount: 234, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p8', name: 'The Art of Design Thinking', slug: 'the-art-of-design-thinking', description: '', price: 24.99, comparePrice: 32.99, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'], category: { id: '5', name: 'Books', slug: 'books' }, categoryId: '5', stock: 300, rating: 4.8, reviewCount: 89, featured: true, active: true, createdAt: '', updatedAt: '' },
  { id: 'p18', name: 'Clean Code Handbook', slug: 'clean-code-handbook', description: '', price: 39.99, images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'], category: { id: '5', name: 'Books', slug: 'books' }, categoryId: '5', stock: 250, rating: 4.9, reviewCount: 445, featured: false, active: true, createdAt: '', updatedAt: '' },
  { id: 'p19', name: 'Mindful Living Journal', slug: 'mindful-living-journal', description: '', price: 19.99, images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600'], category: { id: '5', name: 'Books', slug: 'books' }, categoryId: '5', stock: 400, rating: 4.6, reviewCount: 167, featured: false, active: true, createdAt: '', updatedAt: '' },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  const debouncedSearch = useDebounce(searchInput, 400);

  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentFeatured = searchParams.get('featured') || '';

  // Try to load categories from backend
  useEffect(() => {
    productsApi.getCategories().then((cats) => {
      if (cats.length > 0) setCategories(cats);
    }).catch(() => {});
  }, []);

  // Fetch products — try backend first, fallback to demo filtering
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await productsApi.getProducts({
          page: currentPage,
          search: debouncedSearch,
          category: currentCategory,
          sort: currentSort as any,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          featured: currentFeatured,
        });
        setProducts(result.products);
        setPagination(result.pagination);
        setIsDemo(false);
      } catch {
        // Backend not available — filter demo data locally
        let filtered = [...ALL_DEMO_PRODUCTS];

        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
        }
        if (currentCategory) {
          filtered = filtered.filter(p => p.category.slug === currentCategory);
        }
        if (currentFeatured === 'true') {
          filtered = filtered.filter(p => p.featured);
        }
        if (currentMinPrice) {
          filtered = filtered.filter(p => p.price >= parseFloat(currentMinPrice));
        }
        if (currentMaxPrice) {
          filtered = filtered.filter(p => p.price <= parseFloat(currentMaxPrice));
        }

        // Sorting
        switch (currentSort) {
          case 'price_asc': filtered.sort((a, b) => a.price - b.price); break;
          case 'price_desc': filtered.sort((a, b) => b.price - a.price); break;
          case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
          case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
        }

        // Pagination
        const limit = 12;
        const start = (currentPage - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        setProducts(paged);
        setPagination({ page: currentPage, limit, total: filtered.length, totalPages: Math.ceil(filtered.length / limit) });
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, debouncedSearch, currentCategory, currentSort, currentMinPrice, currentMaxPrice, currentFeatured]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentFeatured || debouncedSearch;

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }} id="product-listing-page">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
          {currentCategory ? categories.find(c => c.slug === currentCategory)?.name || 'Products' : currentFeatured ? 'Featured Products' : 'All Products'}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          {pagination ? `${pagination.total} products found` : 'Loading...'}
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div className="input-with-icon" style={{ flex: '1', minWidth: 200 }}>
          <HiOutlineSearch className="input-icon" />
          <input
            className="input"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              updateFilter('search', e.target.value);
            }}
            id="search-input"
            aria-label="Search products"
          />
        </div>

        <select
          className="input"
          style={{ width: 'auto', minWidth: 160 }}
          value={currentSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          id="sort-select"
          aria-label="Sort products"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          className={`btn ${filtersOpen ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setFiltersOpen(!filtersOpen)}
          id="filter-toggle-btn"
        >
          <HiOutlineAdjustments /> Filters
        </button>

        {hasActiveFilters && (
          <button className="btn btn-ghost" onClick={clearFilters} style={{ color: 'var(--color-error)' }}>
            <HiOutlineX /> Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
          style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
            {/* Categories */}
            <div>
              <label className="input-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <button
                  className={`btn btn-sm ${!currentCategory ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateFilter('category', '')}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`btn btn-sm ${currentCategory === cat.slug ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => updateFilter('category', cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="input-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>Price Range</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                <input
                  className="input"
                  type="number"
                  placeholder="Min"
                  value={currentMinPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  style={{ width: 100 }}
                  aria-label="Minimum price"
                />
                <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                <input
                  className="input"
                  type="number"
                  placeholder="Max"
                  value={currentMaxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  style={{ width: 100 }}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)', opacity: 0.3 }}>🔍</div>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
            No products found
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Try adjusting your search or filters
          </p>
          <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-12)',
        }}>
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => updateFilter('page', String(i + 1))}
              style={{ minWidth: 40 }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
