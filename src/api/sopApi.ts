import { apiClient } from './client';
import { adaptSop } from './adapters';
import { BackendSop } from './backendTypes';
import { SOPDocument } from '../types';

export const sopApi = {
  async list(): Promise<SOPDocument[]> {
    const res = await apiClient.get('/sops');
    return (res.data.data as BackendSop[]).map(adaptSop);
  },

  async signOff(sopId: string): Promise<SOPDocument> {
    const res = await apiClient.post(`/sops/${sopId}/sign-off`);
    return adaptSop(res.data.data as BackendSop);
  }
};
