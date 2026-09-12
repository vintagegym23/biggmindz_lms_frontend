import { apiClient } from './client';
import { BackendCertificate } from './backendTypes';

export const certificateApi = {
  async listMine(): Promise<BackendCertificate[]> {
    const res = await apiClient.get('/certificates/mine');
    return res.data.data;
  }
};
