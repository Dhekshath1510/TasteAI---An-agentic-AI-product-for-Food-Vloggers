import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, LayoutDashboard, Settings, User, LogOut,
  ChefHat, X, Bot, Search
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import { ROUTES } from '../../config/constants';

const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Discover', path: '/discover', icon: Search },
  { label: 'AI Agents', path: '/agents', icon: Bot },
  { label: 'Profile', path: ROUTES.PROFILE, icon: User },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

const adminItems = [
  { label: 'User Management', path: ROUTES.ADMIN_USERS, icon: Users },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40"
            style={{ background: 'var(--bg-overlay)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="sidebar gradient-sidebar"
        animate={{ x: sidebarOpen ? 0 : -260 }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="btn-primary" style={{
              width: 36, height: 36, borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0
            }}>
              <ChefHat size={18} />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1 }} className="text-primary">TasteAI</div>
              <div style={{ fontSize: 11, marginTop: 2 }} className="text-muted">Food Discovery</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm md:hidden"
            style={{ padding: '6px', borderRadius: 8 }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* User pill */}
        <div style={{ margin: '12px 8px', padding: '10px 12px', borderRadius: 10, background: 'var(--input-bg)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="text-primary">{user?.fullName}</div>
            <div style={{ fontSize: 11 }} className="text-muted capitalize">{user?.role}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto', paddingTop: 8 }}>
          <div style={{ padding: '4px 16px 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }} className="text-muted">
            Main
          </div>
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 8 }} className="text-muted">
                Admin
              </div>
              {adminItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </>
          )}

          {/* Coming soon items */}
          <div style={{ padding: '12px 16px 8px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 8 }} className="text-muted">
            Coming Soon
          </div>
          {[
            { label: 'Instagram Intel', icon: '📸' },
            { label: 'Smart Recs', icon: '🤖' },
            { label: 'Analytics', icon: '📊' },
          ].map(({ label, icon }) => (
            <div key={label} className="sidebar-nav-item" style={{ opacity: 0.4, cursor: 'not-allowed' }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              <span style={{ fontSize: 13 }}>{label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px', background: 'var(--input-bg)', borderRadius: 4, color: 'var(--text-muted)', fontWeight: 600 }}>SOON</span>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '8px 8px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleLogout}
            className="sidebar-nav-item btn-danger"
            style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', color: '#f87171' }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
