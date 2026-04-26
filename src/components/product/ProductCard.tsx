import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiStar, HiOutlineShoppingBag } from 'react-icons/hi';
import type { Product } from '../../types/product';
import { formatCurrency, getDiscountPercentage } from '../../utils/helpers';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();

  const discount = product.comparePrice
    ? getDiscountPercentage(Number(product.price), Number(product.comparePrice))
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.id, 1, {
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      images: product.images,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products/${product.slug}`} className="product-card" id={`product-card-${product.slug}`}>
        <div className="product-card-image">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
          />
          {discount && (
            <span className="product-card-badge">-{discount}%</span>
          )}
          <button
            className="product-card-wishlist"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            aria-label={`Add ${product.name} to wishlist`}
          >
            <HiOutlineHeart />
          </button>
        </div>

        <div className="product-card-info">
          <span className="product-card-category">
            {product.category?.name}
          </span>
          <h3 className="product-card-name line-clamp-2">{product.name}</h3>

          <div className="product-card-rating">
            <div className="product-card-stars">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  style={{
                    color: i < Math.floor(product.rating) ? '#fbbf24' : 'var(--color-text-muted)',
                    fontSize: '14px',
                  }}
                />
              ))}
            </div>
            <span className="product-card-review-count">({product.reviewCount})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
            <div className="product-card-price">
              <span className="product-card-price-current">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="product-card-price-compare">{formatCurrency(product.comparePrice)}</span>
              )}
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              id={`add-cart-${product.slug}`}
              style={{ flexShrink: 0, gap: 'var(--space-1)', padding: 'var(--space-2) var(--space-3)' }}
            >
              <HiOutlineShoppingBag style={{ fontSize: '14px' }} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
