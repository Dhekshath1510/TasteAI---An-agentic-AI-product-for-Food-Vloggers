import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Moon, Sun, Monitor, Bell, Shield, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeProvider';
import type { ThemePreference } from '../types';

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="card" style={{ padding: 28, marginBottom: 20 }}>
    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }} className="text-primary">
      {icon} {title}
    </h2>
    {children}
  </div>
);

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: ThemePreference; icon: React.ReactNode; label: string; desc: string }[] = [
    { value: 'light', icon: <Sun size={17} />, label: 'Light Mode', desc: 'Bright and clean interface' },
    { value: 'dark', icon: <Moon size={17} />, label: 'Dark Mode', desc: 'Easy on the eyes in low light' },
    { value: 'system', icon: <Monitor size={17} />, label: 'System Default', desc: 'Follows your OS preference' },
  ];

  return (
    <div style={{ maxWidth: 680 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }} className="text-primary">Settings</h1>
        <p className="text-secondary" style={{ marginBottom: 32 }}>Customize your TasteAI experience.</p>

        <Section title="Appearance" icon={<Settings size={17} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {themeOptions.map(({ value, icon, label, desc }) => (
              <button
                key={value}
                id={`settings-theme-${value}`}
                onClick={() => setTheme(value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                  borderRadius: 10, border: theme === value ? '1px solid rgba(255,125,10,0.35)' : '1px solid var(--border-subtle)',
                  background: theme === value ? 'rgba(255,125,10,0.07)' : 'var(--input-bg)',
                  cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 200ms ease',
                }}
              >
                <span style={{ color: theme === value ? 'var(--color-brand-400)' : 'var(--text-secondary)' }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600 }} className="text-primary">{label}</p>
                  <p style={{ fontSize: 12 }} className="text-muted">{desc}</p>
                </div>
                {theme === value && (
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-brand-500)', flexShrink: 0 }} />
                )}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Notifications" icon={<Bell size={17} />}>
          {[
            { id: 'notif-new-discovery', label: 'New Food Discoveries', desc: 'When new matches appear for your taste profile', defaultOn: true },
            { id: 'notif-trending', label: 'Trending Alerts', desc: 'When a restaurant goes viral near you', defaultOn: false },
            { id: 'notif-weekly', label: 'Weekly Digest', desc: 'Summary of top food picks every Sunday', defaultOn: true },
          ].map(({ id, label, desc, defaultOn }) => (
            <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }} className="text-primary">{label}</p>
                <p style={{ fontSize: 12 }} className="text-muted">{desc}</p>
              </div>
              <label style={{ position: 'relative', width: 40, height: 22, cursor: 'pointer' }}>
                <input id={id} type="checkbox" defaultChecked={defaultOn} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: 11,
                  background: defaultOn ? 'var(--color-brand-500)' : 'var(--border-muted)',
                  transition: '200ms',
                }} />
                <span style={{
                  position: 'absolute', left: defaultOn ? 20 : 2, top: 2,
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  transition: '200ms', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </label>
            </div>
          ))}
        </Section>

        <Section title="Privacy & Security" icon={<Shield size={17} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button id="change-password-btn" className="btn btn-secondary" style={{ alignSelf: 'flex-start', gap: 8 }}>
              🔑 Change Password
            </button>
            <p style={{ fontSize: 12 }} className="text-muted">
              Changing your password will log you out of all other devices.
            </p>
          </div>
        </Section>

        <Section title="Danger Zone" icon={<Trash2 size={17} style={{ color: '#f87171' }} />}>
          <p style={{ fontSize: 14, marginBottom: 14 }} className="text-secondary">
            Deleting your account is permanent and cannot be undone. All data will be removed.
          </p>
          <button id="delete-account-btn" className="btn btn-danger" style={{ gap: 8 }}>
            <Trash2 size={15} /> Delete My Account
          </button>
        </Section>
      </motion.div>
    </div>
  );
};

export default SettingsPage;
