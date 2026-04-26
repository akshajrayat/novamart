import { Link } from 'react-router-dom';
import { HiOutlineHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="header-logo" style={{ marginBottom: 'var(--space-2)' }}>
              <div className="header-logo-icon">N</div>
              <span>Nova<span className="text-gradient">Mart</span></span>
            </div>
            <p>
              Your premium destination for curated products. Discover quality, style, and innovation — all in one place.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Shop</h4>
            <div className="footer-links">
              <Link to="/products" className="footer-link">All Products</Link>
              <Link to="/products?category=electronics" className="footer-link">Electronics</Link>
              <Link to="/products?category=clothing" className="footer-link">Clothing</Link>
              <Link to="/products?category=home-living" className="footer-link">Home & Living</Link>
              <Link to="/products?featured=true" className="footer-link">Featured</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Account</h4>
            <div className="footer-links">
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Create Account</Link>
              <Link to="/orders" className="footer-link">Order History</Link>
              <Link to="/wishlist" className="footer-link">Wishlist</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Help Center</a>
              <a href="#" className="footer-link">Shipping & Returns</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NovaMart. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Made with <HiOutlineHeart style={{ color: 'var(--color-error)' }} /> for a Capstone Project
          </p>
        </div>
      </div>
    </footer>
  );
}
