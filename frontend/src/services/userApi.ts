import axiosInstance from './axiosInstance';
import type { User, UpdateProfilePayload, ApiResponse } from '../types';

export const userApi = {
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosInstance.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfilePayload): Promise<ApiResponse<{ user: User }>> => {
    const response = await axiosInstance.put('/users/profile', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<ApiResponse<{ user: User }>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await axiosInstance.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
