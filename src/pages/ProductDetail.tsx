import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiOutlineHeart, HiOutlineShoppingBag, HiOutlineMinus, HiOutlinePlus, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { productsApi } from '../api/products.api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, getDiscountPercentage, formatDate } from '../utils/helpers';
import type { Product } from '../types/product';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await productsApi.getProductBySlug(slug);
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItem(product.id, quantity, {
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        stock: product.stock,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>
          <div className="skeleton" style={{ aspectRatio: 1, borderRadius: 'var(--radius-2xl)' }} />
          <div>
            <div className="skeleton" style={{ height: 24, width: '60%', marginBottom: 'var(--space-4)' }} />
            <div className="skeleton" style={{ height: 40, marginBottom: 'var(--space-4)' }} />
            <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 'var(--space-6)' }} />
            <div className="skeleton" style={{ height: 100, marginBottom: 'var(--space-6)' }} />
            <div className="skeleton" style={{ height: 48 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Product Not Found</h2>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const discount = product.comparePrice ? getDiscountPercentage(Number(product.price), Number(product.comparePrice)) : null;

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }} id="product-detail-page">
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }} aria-label="Breadcrumb">
        <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
        {' / '}
        <Link to="/products" style={{ color: 'var(--color-text-muted)' }}>Products</Link>
        {' / '}
        <Link to={`/products?category=${product.category.slug}`} style={{ color: 'var(--color-text-muted)' }}>{product.category.name}</Link>
        {' / '}
        <span style={{ color: 'var(--color-text-primary)' }}>{product.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-12)', alignItems: 'start' }}>
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{
            aspectRatio: 1,
            borderRadius: 'var(--radius-2xl)',
            overflow: 'hidden',
            background: 'var(--color-bg-tertiary)',
            marginBottom: 'var(--space-4)',
            border: '1px solid var(--color-border)',
          }}>
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    border: `2px solid ${selectedImage === i ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                    opacity: selectedImage === i ? 1 : 0.6,
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.category.name}
          </span>

          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, letterSpacing: '-0.02em', margin: 'var(--space-2) 0 var(--space-4)', lineHeight: 'var(--leading-tight)' }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} style={{ color: i < Math.floor(product.rating) ? '#fbbf24' : 'var(--color-text-muted)', fontSize: 18 }} />
              ))}
            </div>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{product.rating.toFixed(1)}</span>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span style={{ fontSize: 'var(--text-xl)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                {formatCurrency(product.comparePrice)}
              </span>
            )}
            {discount && (
              <span className="badge badge-success" style={{ fontSize: 'var(--text-sm)' }}>Save {discount}%</span>
            )}
          </div>

          {/* Description */}
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-8)' }}>
            {product.description}
          </p>

          {/* Stock Status */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            {product.stock > 0 ? (
              <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge badge-error">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              background: 'var(--color-bg-input)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              padding: 'var(--space-2) var(--space-3)',
            }}>
              <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="btn-icon" aria-label="Decrease"><HiOutlineMinus /></button>
              <span style={{ width: 32, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
              <button onClick={() => quantity < product.stock && setQuantity(q => q + 1)} className="btn-icon" aria-label="Increase"><HiOutlinePlus /></button>
            </div>
            <button
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 200 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0 || cartLoading}
              id="add-to-cart-btn"
            >
              {cartLoading ? <span className="spinner" /> : <><HiOutlineShoppingBag /> Add to Cart</>}
            </button>
            <button className="btn btn-secondary btn-lg" aria-label="Add to wishlist" id="wishlist-toggle-btn">
              <HiOutlineHeart />
            </button>
          </div>

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-6)', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
            {[
              { icon: <HiOutlineTruck />, text: 'Free shipping on orders over $100' },
              { icon: <HiOutlineShieldCheck />, text: 'Secure checkout & encrypted payment' },
              { icon: <HiOutlineRefresh />, text: '30-day easy returns' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-accent)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section style={{ marginTop: 'var(--space-16)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-12)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-8)' }}>
            Customer Reviews ({product.reviewCount})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {product.reviews.map((review) => (
              <div key={review.id} className="glass-card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-accent-soft)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--text-sm)',
                  }}>
                    {review.user.firstName[0]}{review.user.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{review.user.firstName} {review.user.lastName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', gap: 1 }}>
                        {[...Array(5)].map((_, i) => (
                          <HiStar key={i} style={{ color: i < review.rating ? '#fbbf24' : 'var(--color-text-muted)', fontSize: 12 }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
