import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { authService } from '../services/authService';

interface RoleGuardProps {
  allow: Role[];
}

/**
 * Gates a subtree of routes to specific roles. This is a FRONTEND-ONLY
 * convenience (hides/redirects UI); it is not a security boundary. Once a
 * real backend exists, every mutation these routes trigger must also be
 * authorized server-side.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ allow }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to={authService.getDefaultRouteForRole(user.role)} replace />;
  }

  return <Outlet />;
};
