import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChefHat, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { ROUTES } from '../config/constants';

const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(form);
      addToast({ type: 'success', title: 'Account created!', message: 'Please log in with your new credentials.' });
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      addToast({ type: 'error', title: 'Registration failed', message: msg });
    }
  };

  const field = (key: keyof typeof form, label: string, type: string, placeholder: string, id: string) => (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={`form-input ${errors[key] ? 'error' : ''}`}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          style={type === 'password' ? { paddingRight: 44 } : {}}
        />
        {type === 'password' && key === 'password' && (
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {errors[key] && <span className="form-error">{errors[key]}</span>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="hero-glow hero-glow-brand" style={{ position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 460 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div className="btn-primary" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <ChefHat size={20} />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20 }} className="text-primary">TasteAI</span>
        </div>

        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">Create your account</h2>
        <p style={{ fontSize: 14, marginBottom: 32 }} className="text-secondary">
          Already have an account? <Link to={ROUTES.LOGIN} className="text-brand" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {field('fullName', 'Full Name', 'text', 'John Doe', 'reg-fullname')}
          {field('email', 'Email address', 'email', 'you@example.com', 'reg-email')}
          {field('password', 'Password', 'password', '••••••••', 'reg-password')}
          {field('confirmPassword', 'Confirm Password', 'password', '••••••••', 'reg-confirm')}

          <button id="register-submit" type="submit" className="btn btn-primary" disabled={isLoading}
            style={{ marginTop: 8, padding: '13px 24px', fontSize: 15 }}>
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Creating account...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><UserPlus size={17} /> Create Account</span>
            )}
          </button>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
