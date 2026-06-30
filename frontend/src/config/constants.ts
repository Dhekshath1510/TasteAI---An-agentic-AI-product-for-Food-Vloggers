// =============================================================================
// CONSTANTS - Food Discovery Platform
// =============================================================================

export const APP_NAME = 'TasteAI';
export const APP_TAGLINE = 'Discover food through the power of AI';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  NOT_FOUND: '*',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  USERS: 'users',
  DASHBOARD_STATS: 'dashboardStats',
  PROFILE: 'profile',
} as const;

export const TOKEN_KEY = 'fd_access_token';
export const THEME_KEY = 'fd_theme';

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
};

export const TOAST_DURATION = 4000; // ms
