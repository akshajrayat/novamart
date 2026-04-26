import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineShoppingBag, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { productsApi } from '../api/products.api';
import ProductCard from '../components/product/ProductCard';
import type { Product, Category } from '../types/product';

// ─── Demo data so the page works without a backend ──────────────────────
const DEMO_CATEGORIES: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', _count: { products: 6 } },
  { id: '2', name: 'Clothing', slug: 'clothing', description: 'Trendy fashion and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', _count: { products: 5 } },
  { id: '3', name: 'Home & Living', slug: 'home-living', description: 'Everything for your home', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400', _count: { products: 4 } },
  { id: '4', name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Gear for active lifestyles', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba7ae665?w=400', _count: { products: 3 } },
  { id: '5', name: 'Books', slug: 'books', description: 'Bestsellers and classics', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', _count: { products: 3 } },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Wireless Noise-Cancelling Headphones', slug: 'wireless-noise-cancelling-headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 299.99, comparePrice: 349.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1',
    stock: 45, rating: 4.7, reviewCount: 128, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p2', name: 'Ultra-Slim Laptop Pro 16"', slug: 'ultra-slim-laptop-pro-16',
    description: 'Powerful and lightweight laptop with M3 chip, 16GB RAM, and stunning Retina display.',
    price: 1499.99, comparePrice: 1699.99, images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'],
    category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1',
    stock: 20, rating: 4.9, reviewCount: 256, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p3', name: 'Smart Watch Series X', slug: 'smart-watch-series-x',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 399.99, comparePrice: 449.99, images: ['https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600'],
    category: { id: '1', name: 'Electronics', slug: 'electronics' }, categoryId: '1',
    stock: 60, rating: 4.5, reviewCount: 89, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p4', name: 'Premium Cotton Hoodie', slug: 'premium-cotton-hoodie',
    description: 'Ultra-soft 100% organic cotton hoodie with a modern relaxed fit.',
    price: 89.99, comparePrice: 110.00, images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'],
    category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2',
    stock: 120, rating: 4.8, reviewCount: 203, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p5', name: 'Classic Leather Jacket', slug: 'classic-leather-jacket',
    description: 'Timeless genuine leather biker jacket with satin lining.',
    price: 249.99, comparePrice: 299.99, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2',
    stock: 25, rating: 4.6, reviewCount: 78, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p6', name: 'Running Sneakers Air', slug: 'running-sneakers-air',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
    price: 139.99, comparePrice: 169.99, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    category: { id: '2', name: 'Clothing', slug: 'clothing' }, categoryId: '2',
    stock: 80, rating: 4.7, reviewCount: 312, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p7', name: 'Ergonomic Office Chair', slug: 'ergonomic-office-chair',
    description: 'Premium ergonomic chair with lumbar support, adjustable armrests, and memory foam seat.',
    price: 449.99, comparePrice: 549.99, images: ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'],
    category: { id: '3', name: 'Home & Living', slug: 'home-living' }, categoryId: '3',
    stock: 15, rating: 4.7, reviewCount: 183, featured: true, active: true, createdAt: '', updatedAt: '',
  },
  {
    id: 'p8', name: 'The Art of Design Thinking', slug: 'the-art-of-design-thinking',
    description: 'A comprehensive guide to design thinking methodology for innovators.',
    price: 24.99, comparePrice: 32.99, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600'],
    category: { id: '5', name: 'Books', slug: 'books' }, categoryId: '5',
    stock: 300, rating: 4.8, reviewCount: 89, featured: true, active: true, createdAt: '', updatedAt: '',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEMO_CATEGORIES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to load from backend, fall back to demo data
    const fetchData = async () => {
      try {
        const [featured, cats] = await Promise.all([
          productsApi.getFeaturedProducts(),
          productsApi.getCategories(),
        ]);
        if (featured.length > 0) setFeaturedProducts(featured);
        if (cats.length > 0) setCategories(cats);
      } catch {
        // Backend not available — demo data is already set
      }
    };
    fetchData();
  }, []);

  const features = [
    { icon: <HiOutlineTruck size={24} />, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: <HiOutlineShieldCheck size={24} />, title: 'Secure Payment', desc: '100% protected transactions' },
    { icon: <HiOutlineRefresh size={24} />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <HiOutlineShoppingBag size={24} />, title: 'Premium Quality', desc: 'Curated collections' },
  ];

  return (
    <div id="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hero-badge">
              ✨ New Collection 2026 — Shop Now
            </div>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover Products That{' '}
            <span className="text-gradient">Define You</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explore our curated collection of premium products. From cutting-edge tech 
            to timeless fashion — find everything you love in one place.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/products" className="btn btn-primary btn-lg" id="shop-now-btn">
              Shop Now <HiOutlineArrowRight />
            </Link>
            <Link to="/products?featured=true" className="btn btn-secondary btn-lg" id="featured-btn">
              View Featured
            </Link>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="hero-stat">
              <div className="hero-stat-value text-gradient">500+</div>
              <div className="hero-stat-label">Products</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value text-gradient">10K+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value text-gradient">4.9★</div>
              <div className="hero-stat-label">Average Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section style={{ padding: 'var(--space-8) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
              >
                <div style={{ color: 'var(--color-accent)', flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{f.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
          >
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
              Shop by Category
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Browse our carefully selected categories to find exactly what you're looking for
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="card"
                  id={`category-${cat.slug}`}
                  style={{
                    display: 'block',
                    padding: 'var(--space-6)',
                    textAlign: 'center',
                    transition: 'all var(--transition-base)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {cat.image && (
                    <div style={{
                      width: 72,
                      height: 72,
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      margin: '0 auto var(--space-4)',
                      background: 'var(--color-bg-tertiary)',
                    }}>
                      <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <h3 style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {cat._count?.products || 0} products
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)', flexWrap: 'wrap', gap: 'var(--space-4)' }}
          >
            <div>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
                Featured Products
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                Handpicked selections, trending right now
              </p>
            </div>
            <Link to="/products?featured=true" className="btn btn-secondary">
              View All <HiOutlineArrowRight />
            </Link>
          </motion.div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 380, borderRadius: 'var(--radius-xl)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
              {featuredProducts.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card"
            style={{
              padding: 'var(--space-16)',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(108, 60, 250, 0.05), rgba(6, 182, 160, 0.03))',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-2xl)',
            }}
          >
            <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 'var(--space-4)' }}>
              Ready to Elevate Your Style?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto var(--space-8)', lineHeight: 'var(--leading-relaxed)' }}>
              Join thousands of happy customers who've discovered their perfect products. 
              Sign up today and get 10% off your first order.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Account
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
