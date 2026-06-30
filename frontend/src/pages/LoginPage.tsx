import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChefHat, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { ROUTES } from '../config/constants';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login({ email: form.email, password: form.password });
      addToast({ type: 'success', title: 'Welcome back!', message: 'You have logged in successfully.' });
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      addToast({ type: 'error', title: 'Login failed', message: msg });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex' }}>
      {/* Left brand panel */}
      <div className="gradient-hero" style={{
        flex: 1, display: 'none', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: 48, position: 'relative', overflow: 'hidden'
      }} id="login-brand-panel">
        <style>{`@media (min-width: 1024px) { #login-brand-panel { display: flex; } }`}</style>
        <div className="hero-glow hero-glow-brand" style={{ opacity: 0.6 }} />
        <div className="hero-glow hero-glow-accent" style={{ opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🍜</div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 40, fontWeight: 800, marginBottom: 16, lineHeight: 1.1 }}>
            <span className="gradient-brand-text">Discover food</span>
            <br />
            <span className="text-primary">before it trends</span>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 320, lineHeight: 1.7 }}>
            AI agents that analyze millions of Instagram posts to surface the best food discoveries near you.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', minWidth: 0,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
            <div className="btn-primary" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
              <ChefHat size={20} />
            </div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20 }} className="text-primary">TasteAI</span>
          </div>

          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">
            Welcome back 👋
          </h2>
          <p style={{ fontSize: 14, marginBottom: 32 }} className="text-secondary">
            Don't have an account? <Link to={ROUTES.REGISTER} className="text-brand" style={{ fontWeight: 600 }}>Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="login-password">Password</label>
                <Link to={ROUTES.FORGOT_PASSWORD} style={{ fontSize: 12, color: 'var(--color-brand-400)', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ marginTop: 8, padding: '13px 24px', fontSize: 15 }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <LogIn size={17} /> Sign In
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
