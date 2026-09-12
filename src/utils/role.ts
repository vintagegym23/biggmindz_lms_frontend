import { Role } from '../types';

export const isStaffRole = (role: Role): boolean => role === 'admin' || role === 'tutor';
