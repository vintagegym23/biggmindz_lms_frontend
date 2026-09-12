import { apiClient, tokenStorage } from './client';
import { adaptUser } from './adapters';
import { BackendUser } from './backendTypes';
import { User } from '../types';

export const authApi = {
  async login(email: string, password: string): Promise<User> {
    const res = await apiClient.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data.data;
    tokenStorage.setTokens(accessToken, refreshToken);
    return adaptUser(user as BackendUser);
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    tokenStorage.clear();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => {});
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (!tokenStorage.getAccessToken()) return null;
    try {
      const res = await apiClient.get('/auth/me');
      return adaptUser(res.data.data as BackendUser);
    } catch {
      return null;
    }
  }
};
