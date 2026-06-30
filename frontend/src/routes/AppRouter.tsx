import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { ProtectedRoute, PublicRoute } from './guards';
import MainLayout from '../components/layout/MainLayout';

// Lazy-loaded pages
const LandingPage        = lazy(() => import('../pages/LandingPage'));
const LoginPage          = lazy(() => import('../pages/LoginPage'));
const RegisterPage       = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('../pages/ResetPasswordPage'));
const DashboardPage      = lazy(() => import('../pages/DashboardPage'));
const ProfilePage        = lazy(() => import('../pages/ProfilePage'));
const SettingsPage       = lazy(() => import('../pages/SettingsPage'));
const AdminUsersPage     = lazy(() => import('../pages/AdminUsersPage'));
const NotFoundPage       = lazy(() => import('../pages/NotFoundPage'));

const PageLoader = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-primary)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid var(--border-muted)',
        borderTopColor: 'var(--color-brand-500)',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 16px'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
    </div>
  </div>
);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public landing */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />

        {/* Auth routes (redirect to dashboard if logged in) */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />

            {/* Admin routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path={ROUTES.ADMIN} element={<Navigate to={ROUTES.ADMIN_USERS} replace />} />
              <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
