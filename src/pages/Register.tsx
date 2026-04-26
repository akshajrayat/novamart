import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const updateForm = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      toast.success('Account created successfully!');
      navigate('/');
    } catch {
      // handled by store
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--header-height))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }} id="register-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: 440, padding: 'var(--space-10)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Link to="/" className="header-logo" style={{ justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="header-logo-icon">N</div>
            <span>Nova<span className="text-gradient">Mart</span></span>
          </Link>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Create Account</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>Join NovaMart and start shopping</p>
        </div>

        {error && (
          <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-error-soft)', color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="input-group">
              <label htmlFor="firstName" className="input-label">First Name</label>
              <div className="input-with-icon">
                <HiOutlineUser className="input-icon" />
                <input id="firstName" className="input" placeholder="John" value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} required />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="lastName" className="input-label">Last Name</label>
              <input id="lastName" className="input" placeholder="Doe" value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="regEmail" className="input-label">Email</label>
            <div className="input-with-icon">
              <HiOutlineMail className="input-icon" />
              <input id="regEmail" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="regPassword" className="input-label">Password</label>
            <div className="input-with-icon" style={{ position: 'relative' }}>
              <HiOutlineLockClosed className="input-icon" />
              <input id="regPassword" type={showPassword ? 'text' : 'password'} className="input" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required minLength={8} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 'var(--text-lg)', background: 'none', border: 'none' }}>
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <div className="input-with-icon">
              <HiOutlineLockClosed className="input-icon" />
              <input id="confirmPassword" type="password" className="input" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-2)' }} disabled={isLoading} id="submit-register-btn">
            {isLoading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
