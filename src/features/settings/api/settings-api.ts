import { apiClient } from '@/shared/config/axios';

export const settingsApi = {
  updateProfile: async (data: { name: string }) => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  changeEmail: async (data: { newEmail: string; password: string }) => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.patch('/auth/profile', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return response.data;
  },
};
