import { apiClient } from './client';
import { adaptEmployee } from './adapters';
import { BackendEmployeeListItem } from './backendTypes';
import { TraineeProgress } from '../types';

export const employeeApi = {
  async list(): Promise<TraineeProgress[]> {
    const res = await apiClient.get('/employees');
    return (res.data.data as BackendEmployeeListItem[]).map(adaptEmployee);
  },

  async create(input: { name: string; email: string; department: string; role: string; password: string }): Promise<TraineeProgress> {
    const res = await apiClient.post('/employees', {
      name: input.name,
      email: input.email,
      department: input.department,
      title: input.role,
      password: input.password
    });
    return adaptEmployee(res.data.data);
  },

  async deactivate(userId: string): Promise<TraineeProgress> {
    const res = await apiClient.patch(`/employees/${userId}/deactivate`);
    return adaptEmployee(res.data.data);
  },

  async reactivate(userId: string): Promise<TraineeProgress> {
    const res = await apiClient.patch(`/employees/${userId}/reactivate`);
    return adaptEmployee(res.data.data);
  },

  async resetPassword(userId: string, password: string): Promise<void> {
    await apiClient.patch(`/employees/${userId}/reset-password`, { password });
  }
};
