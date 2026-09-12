import { User } from '../types';

/**
 * Pure routing helper — actual authentication now lives in `src/api/authApi.ts`
 * (real JWT login/refresh/logout against the backend). This file only keeps
 * the one stateless piece every layout/guard needs: which dashboard a role
 * lands on.
 */
export const authService = {
  getDefaultRouteForRole(role: User['role']): string {
    return role === 'employee' ? '/employee/dashboard' : '/admin/dashboard';
  }
};
