import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineX, HiOutlinePlus, HiOutlineMinus, HiOutlineTrash } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/helpers';

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCartStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            id="cart-overlay"
          />

          {/* Drawer */}
          <motion.div
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            id="cart-drawer"
          >
            <div className="drawer-header">
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                Shopping Cart
                {cart && cart.itemCount > 0 && (
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: 'var(--text-sm)', marginLeft: 'var(--space-2)' }}>
                    ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h2>
              <button
                className="btn-icon btn-ghost"
                onClick={closeCart}
                aria-label="Close cart"
                id="close-cart-btn"
              >
                <HiOutlineX size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {!cart || cart.items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12) 0' }}>
                  <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)', opacity: 0.3 }}>🛒</div>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                    Your cart is empty
                  </p>
                  <Link to="/products" className="btn btn-primary" onClick={closeCart}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        display: 'flex',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        background: 'var(--color-bg-glass)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <Link
                        to={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: 'var(--color-bg-tertiary)',
                        }}
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Link>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 className="truncate" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                          {item.product.name}
                        </h4>
                        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent)', marginBottom: 'var(--space-3)' }}>
                          {formatCurrency(item.product.price)}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', padding: '2px' }}>
                            <button
                              className="btn-icon"
                              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
                              onClick={() => {
                                if (item.quantity > 1) updateItem(item.id, item.quantity - 1);
                              }}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <HiOutlineMinus />
                            </button>
                            <span style={{ width: 28, textAlign: 'center', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                              {item.quantity}
                            </span>
                            <button
                              className="btn-icon"
                              style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)', fontSize: '14px' }}
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              aria-label="Increase quantity"
                            >
                              <HiOutlinePlus />
                            </button>
                          </div>

                          <button
                            className="btn-icon"
                            style={{ color: 'var(--color-error)', fontSize: '16px' }}
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="drawer-footer">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{formatCurrency(cart.total)}</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={closeCart}
                  id="checkout-btn"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/cart"
                  className="btn btn-secondary"
                  style={{ width: '100%', marginTop: 'var(--space-3)' }}
                  onClick={closeCart}
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
