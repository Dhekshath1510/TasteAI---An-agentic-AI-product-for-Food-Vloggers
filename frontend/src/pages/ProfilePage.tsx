import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User } from 'lucide-react';
import { userApi } from '../services/userApi';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import type { ThemePreference } from '../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUIStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    theme: (user?.theme || 'system') as ThemePreference,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const avatarSrc = user?.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await userApi.updateProfile({ fullName: form.fullName, theme: form.theme });
      if (res.data?.user) updateUser(res.data.user);
      addToast({ type: 'success', title: 'Profile updated!' });
    } catch {
      addToast({ type: 'error', title: 'Update failed', message: 'Could not save changes.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await userApi.uploadAvatar(file);
      if (res.data?.user) updateUser(res.data.user);
      addToast({ type: 'success', title: 'Avatar updated!' });
    } catch {
      addToast({ type: 'error', title: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">Your Profile</h1>
        <p className="text-secondary" style={{ marginBottom: 32 }}>Manage your personal information and preferences.</p>

        {/* Avatar */}
        <div className="card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: avatarSrc ? `url(${avatarSrc}) center/cover` : 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 28, fontWeight: 700,
                border: '3px solid var(--border-muted)',
              }}>
                {!avatarSrc && (user?.fullName?.[0]?.toUpperCase() ?? '?')}
              </div>
              <button
                id="avatar-upload-btn"
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--color-brand-500)', border: '2px solid var(--bg-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', cursor: 'pointer',
                }}
              >
                <Camera size={12} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 18 }} className="text-primary">{user?.fullName}</p>
              <p style={{ fontSize: 13 }} className="text-secondary">{user?.email}</p>
              <span className={`badge badge-${user?.role}`} style={{ marginTop: 6 }}>{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }} className="text-primary">
            <User size={17} /> Account Details
          </h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-fullname">Full Name</label>
              <input id="profile-fullname" type="text" className="form-input"
                value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              <span style={{ fontSize: 11 }} className="text-muted">Email cannot be changed</span>
            </div>
            <div className="form-group">
              <label className="form-label">Theme Preference</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['light', 'dark', 'system'] as ThemePreference[]).map((t) => (
                  <button key={t} type="button"
                    onClick={() => setForm({ ...form, theme: t })}
                    className={`btn ${form.theme === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ textTransform: 'capitalize', flex: 1 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Member Since</label>
              <p style={{ fontSize: 14 }} className="text-secondary">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </p>
            </div>

            <button id="save-profile-btn" type="submit" className="btn btn-primary" disabled={isLoading} style={{ alignSelf: 'flex-start', gap: 8 }}>
              <Save size={16} /> {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
