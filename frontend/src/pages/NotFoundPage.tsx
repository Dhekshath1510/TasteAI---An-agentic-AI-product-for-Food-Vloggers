import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ChefHat } from 'lucide-react';
import { ROUTES } from '../config/constants';

const NotFoundPage: React.FC = () => (
  <div style={{
    minHeight: '100vh', background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px', textAlign: 'center',
  }}>
    <div className="hero-glow hero-glow-brand" style={{ position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)' }} />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ fontSize: 100, marginBottom: 20, lineHeight: 1 }}>🍽️</div>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 100, fontWeight: 900, lineHeight: 1, marginBottom: 16 }} className="gradient-brand-text">
        404
      </p>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }} className="text-primary">
        Page Not Found
      </h1>
      <p style={{ fontSize: 16, maxWidth: 380, margin: '0 auto 36px', lineHeight: 1.7 }} className="text-secondary">
        Looks like this page went off the menu. Head back and keep discovering amazing food.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to={ROUTES.DASHBOARD} className="btn btn-primary" style={{ gap: 8 }}>
          <Home size={16} /> Go to Dashboard
        </Link>
        <Link to={ROUTES.HOME} className="btn btn-secondary" style={{ gap: 8 }}>
          <ChefHat size={16} /> Back to Home
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
