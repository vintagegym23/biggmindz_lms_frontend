import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { authService } from './services/authService';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleGuard } from './routes/RoleGuard';

import { AuthLayout } from './layouts/AuthLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { EmployeeLayout } from './layouts/EmployeeLayout';

import { LoginPage } from './pages/auth/LoginPage';

/**
 * Admin and Employee pages are lazy-loaded so an employee never downloads
 * the Course Builder / Video Review Workspace / Analytics chart code (and
 * vice versa for admins). `lazyNamed` keeps every page module's existing
 * named export as-is — only this file needs to know about code-splitting.
 */
function lazyNamed<T extends React.ComponentType<any>>(
  factory: () => Promise<Record<string, T>>,
  exportName: string
) {
  return lazy(() => factory().then((module) => ({ default: module[exportName] })));
}

const AdminDashboardPage = lazyNamed(() => import('./pages/admin/AdminDashboardPage'), 'AdminDashboardPage');
const EmployeesPage = lazyNamed(() => import('./pages/admin/EmployeesPage'), 'EmployeesPage');
const CoursesPage = lazyNamed(() => import('./pages/admin/CoursesPage'), 'CoursesPage');
const CourseBuilderPage = lazyNamed(() => import('./pages/admin/CourseBuilderPage'), 'CourseBuilderPage');
const SubmissionsPage = lazyNamed(() => import('./pages/admin/SubmissionsPage'), 'SubmissionsPage');
const SubmissionReviewPage = lazyNamed(() => import('./pages/admin/SubmissionReviewPage'), 'SubmissionReviewPage');
const AnalyticsPage = lazyNamed(() => import('./pages/admin/AnalyticsPage'), 'AnalyticsPage');
const AdminSopsPage = lazyNamed(() => import('./pages/admin/SopsPage'), 'AdminSopsPage');
const AdminSopDetailPage = lazyNamed(() => import('./pages/admin/SopDetailPage'), 'AdminSopDetailPage');
const AdminCohortsPage = lazyNamed(() => import('./pages/admin/CohortsPage'), 'AdminCohortsPage');
const AdminSettingsPage = lazyNamed(() => import('./pages/admin/SettingsPage'), 'AdminSettingsPage');

const EmployeeDashboardPage = lazyNamed(() => import('./pages/employee/DashboardPage'), 'EmployeeDashboardPage');
const EmployeeCoursesPage = lazyNamed(() => import('./pages/employee/CoursesPage'), 'EmployeeCoursesPage');
const EmployeeCourseDetailPage = lazyNamed(() => import('./pages/employee/CourseDetailPage'), 'EmployeeCourseDetailPage');
const EmployeeSopsPage = lazyNamed(() => import('./pages/employee/SopsPage'), 'EmployeeSopsPage');
const EmployeeAssignmentsPage = lazyNamed(() => import('./pages/employee/AssignmentsPage'), 'EmployeeAssignmentsPage');
const EmployeeSubmissionsPage = lazyNamed(() => import('./pages/employee/SubmissionsPage'), 'EmployeeSubmissionsPage');
const EmployeeSubmissionDetailPage = lazyNamed(() => import('./pages/employee/SubmissionDetailPage'), 'EmployeeSubmissionDetailPage');
const EmployeeCertificatesPage = lazyNamed(() => import('./pages/employee/CertificatesPage'), 'EmployeeCertificatesPage');
const EmployeeCohortsPage = lazyNamed(() => import('./pages/employee/CohortsPage'), 'EmployeeCohortsPage');
const EmployeeSettingsPage = lazyNamed(() => import('./pages/employee/SettingsPage'), 'EmployeeSettingsPage');

const IndexRedirect: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={authService.getDefaultRouteForRole(user.role)} replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppDataProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              {/* Admin / Tutor */}
              <Route element={<RoleGuard allow={['admin', 'tutor']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/employees" element={<EmployeesPage />} />
                  <Route path="/admin/courses" element={<CoursesPage />} />
                  <Route path="/admin/courses/:courseId" element={<CourseBuilderPage />} />
                  <Route path="/admin/submissions" element={<SubmissionsPage />} />
                  <Route path="/admin/submissions/:submissionId" element={<SubmissionReviewPage />} />
                  <Route path="/admin/analytics" element={<AnalyticsPage />} />
                  <Route path="/admin/sops" element={<AdminSopsPage />} />
                  <Route path="/admin/sops/:sopId" element={<AdminSopDetailPage />} />
                  <Route path="/admin/cohorts" element={<AdminCohortsPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Route>
              </Route>

              {/* Employee */}
              <Route element={<RoleGuard allow={['employee']} />}>
                <Route element={<EmployeeLayout />}>
                  <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
                  <Route path="/employee/courses" element={<EmployeeCoursesPage />} />
                  <Route path="/employee/courses/:courseId" element={<EmployeeCourseDetailPage />} />
                  <Route path="/employee/courses/:courseId/lessons/:lessonId" element={<EmployeeCourseDetailPage />} />
                  <Route path="/employee/sops" element={<EmployeeSopsPage />} />
                  <Route path="/employee/assignments" element={<EmployeeAssignmentsPage />} />
                  <Route path="/employee/assignments/:assignmentId" element={<EmployeeAssignmentsPage />} />
                  <Route path="/employee/submissions" element={<EmployeeSubmissionsPage />} />
                  <Route path="/employee/submissions/:submissionId" element={<EmployeeSubmissionDetailPage />} />
                  <Route path="/employee/certificates" element={<EmployeeCertificatesPage />} />
                  <Route path="/employee/cohorts" element={<EmployeeCohortsPage />} />
                  <Route path="/employee/settings" element={<EmployeeSettingsPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="/" element={<IndexRedirect />} />
            <Route path="*" element={<IndexRedirect />} />
          </Routes>
        </AppDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
