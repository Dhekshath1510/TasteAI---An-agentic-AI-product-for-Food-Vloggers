// =============================================================================
// GLOBAL TYPES - Food Discovery Platform
// =============================================================================

// --- API Response Wrappers ---
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// --- User Types ---
export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'suspended';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  cuisines?: string[];
  notifications?: boolean;
  [key: string]: any;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  profileImage?: string;
  role: UserRole;
  theme: ThemePreference;
  status: UserStatus;
  preferences?: UserPreferences;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Auth Types ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// --- Dashboard Types ---
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newUsersThisMonth: number;
  adminCount: number;
  userCount: number;
}

// --- Admin Types ---
export interface AdminUserFilters {
  search?: string;
  role?: UserRole | '';
  status?: UserStatus | '';
  page?: number;
  limit?: number;
}

// --- Update Profile Types ---
export interface UpdateProfilePayload {
  fullName?: string;
  theme?: ThemePreference;
  preferences?: UserPreferences;
}

// --- Password Reset Types ---
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

// --- Toast Notification Types ---
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// --- Navigation Types ---
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiredRole?: UserRole;
}
