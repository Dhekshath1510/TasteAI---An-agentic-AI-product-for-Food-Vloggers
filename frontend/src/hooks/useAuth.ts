import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/authApi';
import { TOKEN_KEY } from '../config/constants';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, setAuth, clearAuth, setLoading, updateUser } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      if (response.data) {
        setAuth(response.data.user, response.data.accessToken);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterCredentials) => {
    setLoading(true);
    try {
      const { confirmPassword: _, ...payload } = data;
      const response = await authApi.register(payload);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuth();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };
};
