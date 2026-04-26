import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineShoppingBag, HiOutlineHeart, HiOutlineUser, HiOutlineSun, HiOutlineMoon, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useThemeStore } from '../../store/themeStore';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, toggleCart } = useCartStore();
  const { theme, toggleTheme } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    { path: '/products?category=electronics', label: 'Electronics' },
    { path: '/products?category=clothing', label: 'Fashion' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const cartItemCount = cart?.itemCount || 0;

  return (
    <header className="header" id="main-header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo" id="logo-link">
          <div className="header-logo-icon">N</div>
          <span>Nova<span className="text-gradient">Mart</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav" id="main-nav" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header-nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="btn-icon header-cart-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            id="theme-toggle-btn"
          >
            {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
          </button>

          {/* Wishlist */}
          {isAuthenticated && (
            <Link to="/wishlist" className="btn-icon header-cart-btn" aria-label="Wishlist" id="wishlist-btn">
              <HiOutlineHeart />
            </Link>
          )}

          {/* Cart */}
          <button
            className="header-cart-btn"
            onClick={toggleCart}
            aria-label={`Shopping cart with ${cartItemCount} items`}
            id="cart-toggle-btn"
          >
            <HiOutlineShoppingBag />
            {cartItemCount > 0 && (
              <span className="header-cart-count">{cartItemCount}</span>
            )}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                className="btn-icon header-cart-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                id="user-menu-btn"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {user?.firstName[0]}{user?.lastName[0]}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: 8,
                      background: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-xl)',
                      padding: 'var(--space-2)',
                      minWidth: 200,
                      boxShadow: 'var(--shadow-xl)',
                      zIndex: 'var(--z-dropdown)',
                    }}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user?.firstName} {user?.lastName}</div>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>{user?.email}</div>
                    </div>
                    <Link to="/profile" style={{ display: 'block', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      Profile
                    </Link>
                    <Link to="/orders" style={{ display: 'block', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      Orders
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link to="/admin" style={{ display: 'block', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-error)', marginTop: 'var(--space-2)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-3)' }}
                    >
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="btn-icon header-cart-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-btn"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              position: 'absolute',
              top: 'var(--header-height)',
              left: 0,
              right: 0,
              background: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border)',
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`header-nav-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
