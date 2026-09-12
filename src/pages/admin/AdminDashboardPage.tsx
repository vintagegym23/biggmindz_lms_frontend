import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { useAppData } from '../../context/AppDataContext';

const VIEW_TO_PATH: Record<string, string> = {
  'admin-dashboard': '/admin/dashboard',
  'admin-trainees': '/admin/employees',
  'admin-reviews': '/admin/submissions',
  'admin-courses': '/admin/courses',
  'admin-sops': '/admin/sops',
  cohorts: '/admin/cohorts'
};

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, employees, submissions, courses, sops } = useAppData();

  if (!currentUser) return null;

  return (
    <AdminDashboard
      currentAdmin={currentUser}
      trainees={employees}
      submissions={submissions}
      courses={courses}
      sops={sops}
      onOpenReviewModal={(sub) => navigate(`/admin/submissions/${sub.id}`)}
      onNavigateTo={(view) => navigate(VIEW_TO_PATH[view] || '/admin/dashboard')}
    />
  );
};
