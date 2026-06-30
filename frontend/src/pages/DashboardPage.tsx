import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, UserX, TrendingUp, Bot, Zap, Star, ChefHat } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAuthStore } from '../store/authStore';
import { QUERY_KEYS } from '../config/constants';
import type { DashboardStats } from '../types';

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  variant?: 'brand' | 'accent' | 'success' | 'danger';
  delay?: number;
}> = ({ icon, label, value, variant = 'brand', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`stat-card ${variant}`}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }} className="text-secondary">{label}</p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 36, fontWeight: 800, lineHeight: 1 }} className="text-primary">{value}</p>
      </div>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: variant === 'brand' ? 'rgba(255,125,10,0.12)' :
                    variant === 'accent' ? 'rgba(139,92,246,0.12)' :
                    variant === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: variant === 'brand' ? 'var(--color-brand-400)' :
               variant === 'accent' ? 'var(--color-accent-400)' :
               variant === 'success' ? '#4ade80' : '#f87171',
        flexShrink: 0,
      }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: statsResponse, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: adminApi.getDashboardStats,
    staleTime: 60_000,
  });

  const stats: DashboardStats = statsResponse?.data ?? {
    totalUsers: 0, activeUsers: 0, suspendedUsers: 0,
    newUsersThisMonth: 0, adminCount: 0, userCount: 0,
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const aiModules = [
    { emoji: '📸', name: 'Instagram Scraper', status: 'Coming Soon', desc: 'Crawls public food content for trend analysis' },
    { emoji: '🤖', name: 'Recommendation Agent', status: 'Coming Soon', desc: 'Personalized food suggestions via AI' },
    { emoji: '📊', name: 'Analytics Engine', status: 'Coming Soon', desc: 'Trend tracking and audience intelligence' },
    { emoji: '🗺️', name: 'Geo Discovery', status: 'Coming Soon', desc: 'Location-aware food spot discovery' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-brand-400)', fontWeight: 600, marginBottom: 6 }}>{greeting()},</p>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, marginBottom: 8 }} className="text-primary">
          {user?.fullName} 👋
        </h1>
        <p className="text-secondary" style={{ fontSize: 15 }}>
          Here's what's happening on your food discovery platform today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
          ))
        ) : (
          <>
            <StatCard icon={<Users size={20} />} label="Total Users" value={stats.totalUsers} variant="brand" delay={0} />
            <StatCard icon={<UserCheck size={20} />} label="Active Users" value={stats.activeUsers} variant="success" delay={0.08} />
            <StatCard icon={<UserX size={20} />} label="Suspended" value={stats.suspendedUsers} variant="danger" delay={0.16} />
            <StatCard icon={<TrendingUp size={20} />} label="New This Month" value={stats.newUsersThisMonth} variant="accent" delay={0.24} />
          </>
        )}
      </div>

      {/* AI Modules */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Bot size={18} style={{ color: 'var(--color-brand-400)' }} />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700 }} className="text-primary">AI Module Pipeline</h2>
          <span className="badge badge-user" style={{ marginLeft: 4 }}>Module 2+</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {aiModules.map(({ emoji, name, status, desc }) => (
            <div key={name} className="card" style={{ padding: 20, opacity: 0.7 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{emoji}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <p style={{ fontSize: 14, fontWeight: 700 }} className="text-primary">{name}</p>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'var(--input-bg)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>{status}</span>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.6 }} className="text-secondary">{desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ marginTop: 32 }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 16 }} className="text-primary">
          <Zap size={16} style={{ display: 'inline', marginRight: 6, color: 'var(--color-brand-400)' }} />
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '🍕 Browse Discoveries', href: '/discover' },
            { label: '👤 Edit Profile', href: '/profile' },
            { label: '⚙️ Settings', href: '/settings' },
            ...(user?.role === 'admin' ? [{ label: '👑 Admin Panel', href: '/admin/users' }] : []),
          ].map(({ label, href }) => (
            <a key={href} href={href} className="btn btn-secondary btn-sm">{label}</a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
