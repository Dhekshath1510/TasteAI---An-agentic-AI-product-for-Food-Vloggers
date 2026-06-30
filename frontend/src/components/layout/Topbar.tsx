import React from 'react';
import { Menu, Sun, Moon, Monitor, Bell } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../contexts/ThemeProvider';
import type { ThemePreference } from '../../types';

const themeOptions: { value: ThemePreference; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun size={15} />, label: 'Light' },
  { value: 'dark', icon: <Moon size={15} />, label: 'Dark' },
  { value: 'system', icon: <Monitor size={15} />, label: 'System' },
];

const Topbar: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="topbar glass"
      style={{
        left: sidebarOpen ? 'var(--sidebar-width)' : 0,
        right: 0,
        transition: 'left 350ms ease',
        gap: 16,
        justifyContent: 'space-between',
      }}
    >
      <button
        id="sidebar-toggle"
        className="btn btn-ghost"
        style={{ padding: 8, borderRadius: 8 }}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'var(--input-bg)', borderRadius: 8, padding: 3,
          border: '1px solid var(--border-subtle)'
        }}>
          {themeOptions.map(({ value, icon }) => (
            <button
              key={value}
              id={`theme-${value}`}
              onClick={() => setTheme(value)}
              title={value}
              style={{
                padding: '5px 8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: theme === value ? 'var(--bg-card)' : 'transparent',
                color: theme === value ? 'var(--color-brand-400)' : 'var(--text-muted)',
                boxShadow: theme === value ? 'var(--shadow-card)' : 'none',
                transition: 'all 200ms ease',
                display: 'flex', alignItems: 'center',
              }}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Notification bell placeholder */}
        <button id="notifications-btn" className="btn btn-ghost" style={{ padding: 8, borderRadius: 8, position: 'relative' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute', top: 6, right: 6, width: 7, height: 7,
            borderRadius: '50%', background: 'var(--color-brand-500)',
            border: '1.5px solid var(--bg-primary)'
          }} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
