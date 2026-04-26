import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-6)',
    }} id="not-found-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ fontSize: '120px', fontWeight: 900, lineHeight: 1, marginBottom: 'var(--space-4)', opacity: 0.1 }}>404</div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', maxWidth: 400, margin: '0 auto var(--space-8)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/products" className="btn btn-secondary">Browse Products</Link>
        </div>
      </motion.div>
    </div>
  );
}
