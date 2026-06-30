import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Zap, Bot, Camera, Star, ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../config/constants';

const features = [
  { icon: <Bot size={22} />, title: 'AI-Powered Discovery', desc: 'Multi-agent AI analyzes thousands of food posts to surface the best dishes near you.' },
  { icon: <Camera size={22} />, title: 'Instagram Intelligence', desc: 'Scrapes public Instagram data to find trending food spots and viral dishes in real-time.' },
  { icon: <Zap size={22} />, title: 'Smart Recommendations', desc: 'Personalized meal suggestions based on your taste profile, dietary needs, and history.' },
  { icon: <Star size={22} />, title: 'Curated Collections', desc: 'Hand-picked by our AI into themed collections: hidden gems, viral spots, comfort food.' },
];

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        background: 'var(--bg-glass)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="btn-primary" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <ChefHat size={18} />
          </div>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18 }} className="text-primary">TasteAI</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-sm">Log In</Link>
          <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="gradient-hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 80 }}>
        {/* Glow orbs */}
        <div className="hero-glow hero-glow-brand" />
        <div className="hero-glow hero-glow-accent" />

        <div style={{ textAlign: 'center', maxWidth: 760, padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
              borderRadius: 9999, border: '1px solid rgba(255,125,10,0.3)',
              background: 'rgba(255,125,10,0.08)', marginBottom: 28,
            }}>
              <Sparkles size={13} style={{ color: 'var(--color-brand-400)' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand-400)' }}>Powered by Multi-Agent AI</span>
            </div>

            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 800,
              fontSize: 'clamp(40px, 7vw, 76px)', lineHeight: 1.08, marginBottom: 24,
            }}>
              <span className="text-primary">Discover Food</span>{' '}
              <span className="gradient-brand-text glow-brand-text">Intelligently</span>
            </h1>

            <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 540, margin: '0 auto 40px', color: 'var(--text-secondary)' }}>
              AI agents that crawl Instagram, analyze trends, and deliver personalized food discoveries straight to you — before anyone else finds them.
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg animate-pulse-glow">
                Start Discovering <ArrowRight size={18} />
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 64, flexWrap: 'wrap' }}
          >
            {[
              { value: '50K+', label: 'Food Posts Analyzed' },
              { value: '12 AI', label: 'Intelligent Agents' },
              { value: '98%', label: 'Discovery Accuracy' },
            ].map(({ value, label }) => (
              <div key={label} className="glass" style={{ padding: '16px 28px', borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800 }} className="gradient-brand-text">{value}</div>
                <div style={{ fontSize: 12, marginTop: 4 }} className="text-muted">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: 16 }} className="text-primary">
            AI that <span className="gradient-brand-text">tastes the internet</span>
          </h2>
          <p style={{ fontSize: 17, maxWidth: 500, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Our multi-agent system works around the clock, building the ultimate food intelligence network.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }} className="stagger">
          {features.map(({ icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card animate-fade-in"
              style={{ padding: 28 }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, marginBottom: 20,
                background: 'rgba(255,125,10,0.10)', border: '1px solid rgba(255,125,10,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-brand-400)',
              }}>
                {icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }} className="text-primary">{title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7 }} className="text-secondary">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 100px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass"
          style={{ maxWidth: 640, margin: '0 auto', padding: '56px 40px', borderRadius: 24 }}
        >
          <div style={{ fontSize: 48, marginBottom: 20 }}>🍜</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, marginBottom: 16 }} className="text-primary">
            Your next favorite meal is waiting
          </h2>
          <p style={{ fontSize: 16, marginBottom: 32, color: 'var(--text-secondary)' }}>
            Join the platform that discovers food before it goes viral.
          </p>
          <Link to={ROUTES.REGISTER} className="btn btn-primary btn-lg">
            Join for Free <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)', padding: '24px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChefHat size={16} style={{ color: 'var(--color-brand-400)' }} />
          <span style={{ fontSize: 13, fontWeight: 600 }} className="text-primary">TasteAI</span>
        </div>
        <p style={{ fontSize: 12 }} className="text-muted">© 2026 TasteAI. Agentic AI Food Discovery Platform.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
