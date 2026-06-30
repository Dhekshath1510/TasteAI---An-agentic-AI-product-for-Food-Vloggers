import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeProvider';
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Listen for auth:logout event (dispatched by axios interceptor on refresh failure)
  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-muted)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#4ade80', secondary: 'var(--bg-card)' } },
            error: { iconTheme: { primary: '#f87171', secondary: 'var(--bg-card)' } },
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
