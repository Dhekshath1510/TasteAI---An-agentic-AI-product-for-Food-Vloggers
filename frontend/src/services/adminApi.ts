import axiosInstance from './axiosInstance';
import type { User, DashboardStats, AdminUserFilters, PaginatedResponse, ApiResponse } from '../types';

export const adminApi = {
  getUsers: async (filters: AdminUserFilters = {}): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.role) params.set('role', filters.role);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    const response = await axiosInstance.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosInstance.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await axiosInstance.get('/dashboard/stats');
    return response.data;
  },
};
