import { apiClient } from './client';
import { adaptUser } from './adapters';
import { User } from '../types';

export const userApi = {
  async updateProfile(input: { name?: string; email?: string; department?: string; title?: string }): Promise<User> {
    const res = await apiClient.patch('/users/me', input);
    return adaptUser(res.data.data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.patch('/users/me/password', { currentPassword, newPassword });
  },

  async updateNotificationPreferences(prefs: Record<string, boolean>): Promise<void> {
    await apiClient.patch('/users/me/notifications', prefs);
  }
};
