import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/authApi';
import { useUIStore } from '../store/uiStore';
import { ROUTES } from '../config/constants';

const ForgotPasswordPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setSent(true);
      addToast({ type: 'info', title: 'Reset link sent', message: 'Check your email (or server logs in dev mode) for the reset link.' });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div className="btn-primary" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <ChefHat size={20} />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20 }} className="text-primary">TasteAI</span>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📬</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 12 }} className="text-primary">Check your inbox</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>
              If <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> is registered, you'll receive a reset link shortly.
              <br /><br />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>In development: check server logs for the reset URL.</span>
            </p>
            <Link to={ROUTES.LOGIN} className="btn btn-secondary" style={{ gap: 8 }}>
              <ArrowLeft size={15} /> Back to Login
            </Link>
          </motion.div>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">Reset password</h2>
            <p style={{ fontSize: 14, marginBottom: 32 }} className="text-secondary">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email address</label>
                <input id="forgot-email" type="email" className="form-input" placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button id="forgot-submit" type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: '13px', fontSize: 15 }}>
                {isLoading ? 'Sending...' : <><Mail size={16} /> Send Reset Link</>}
              </button>
            </form>
            <Link to={ROUTES.LOGIN} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
              <ArrowLeft size={14} /> Back to login
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
