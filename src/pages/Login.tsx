import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const { fetchCart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      await fetchCart();
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }} id="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: 'var(--space-10)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Link to="/" className="header-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="header-logo-icon">N</div>
            <span>Nova<span className="text-gradient">Mart</span></span>
          </Link>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--color-error-soft)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-4)',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <div className="input-with-icon">
              <HiOutlineMail className="input-icon" />
              <input
                id="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <HiOutlineLockClosed className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-lg)',
                  background: 'none',
                  border: 'none',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={isLoading}
            id="submit-login-btn"
          >
            {isLoading ? <span className="spinner" /> : 'Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: 'var(--space-6)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--color-border)',
        }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>

        {/* Info */}
        <div style={{
          marginTop: 'var(--space-4)',
          padding: 'var(--space-4)',
          background: 'var(--color-accent-soft)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-secondary)',
          textAlign: 'center',
        }}>
          <p>Sign in with your email and password, or <Link to="/register" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>create a new account</Link> to get started.</p>
        </div>
      </motion.div>
    </div>
  );
}
