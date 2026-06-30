import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useUIStore } from '../../store/uiStore';

const MainLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <Topbar />
      <motion.main
        animate={{
          paddingLeft: sidebarOpen ? 'calc(var(--sidebar-width) + 24px)' : '24px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        style={{
          paddingTop: 80,
          paddingRight: 24,
          paddingBottom: 40,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;
