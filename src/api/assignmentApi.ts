import { apiClient } from './client';
import { adaptAssignment } from './adapters';
import { BackendAssignment } from './backendTypes';
import { Assignment } from '../types';

export const assignmentApi = {
  async list(): Promise<Assignment[]> {
    const res = await apiClient.get('/assignments');
    return (res.data.data as BackendAssignment[]).map(adaptAssignment);
  }
};
