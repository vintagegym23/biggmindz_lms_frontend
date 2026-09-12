import { apiClient } from './client';
import { adaptNotification } from './adapters';
import { BackendNotification } from './backendTypes';
import { Notification } from '../types';

export const notificationApi = {
  async list(): Promise<Notification[]> {
    const res = await apiClient.get('/notifications');
    return (res.data.data as BackendNotification[]).map(adaptNotification);
  },

  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch('/notifications/read-all');
  }
};
