import axiosInstance from './axiosInstance';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
} from '../types';

export const authApi = {
  register: async (data: Omit<RegisterCredentials, 'confirmPassword'>): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordPayload): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordPayload): Promise<ApiResponse> => {
    const { confirmPassword: _, ...payload } = data;
    const response = await axiosInstance.post('/auth/reset-password', payload);
    return response.data;
  },
};
