import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Eye, EyeOff, KeyRound } from 'lucide-react';
import { authApi } from '../services/authApi';
import { useUIStore } from '../store/uiStore';
import { ROUTES } from '../config/constants';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { addToast } = useUIStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, password: form.password, confirmPassword: form.confirmPassword });
      addToast({ type: 'success', title: 'Password reset!', message: 'You can now log in with your new password.' });
      navigate(ROUTES.LOGIN);
    } catch {
      addToast({ type: 'error', title: 'Reset failed', message: 'The reset link is invalid or expired.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔗</div>
          <p className="text-secondary">Invalid or missing reset token.</p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="btn btn-primary" style={{ marginTop: 20 }}>Request new link</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div className="btn-primary" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <ChefHat size={20} />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20 }} className="text-primary">TasteAI</span>
        </div>

        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">Set new password</h2>
        <p style={{ fontSize: 14, marginBottom: 32 }} className="text-secondary">Choose a strong password for your account.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {(['password', 'confirmPassword'] as const).map((key) => (
            <div className="form-group" key={key}>
              <label className="form-label" htmlFor={`reset-${key}`}>{key === 'password' ? 'New Password' : 'Confirm Password'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  id={`reset-${key}`}
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors[key] ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  style={{ paddingRight: 44 }}
                />
                {key === 'password' && (
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {errors[key] && <span className="form-error">{errors[key]}</span>}
            </div>
          ))}

          <button id="reset-submit" type="submit" className="btn btn-primary" disabled={isLoading} style={{ padding: '13px', fontSize: 15, gap: 8 }}>
            {isLoading ? 'Resetting...' : <><KeyRound size={16} /> Reset Password</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
