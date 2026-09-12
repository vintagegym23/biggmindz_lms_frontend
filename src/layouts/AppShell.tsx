import React, { Suspense, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { PageLoadingFallback } from '../components/common/PageLoadingFallback';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';

/**
 * Shared chrome (top nav + role-aware sidebar) for both the Admin/Tutor
 * and Employee sections. AdminLayout and EmployeeLayout both render this;
 * the role itself comes from the authenticated user, so there is nothing
 * role-specific to duplicate here.
 */
export const AppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sops, submissions, notifications, markNotificationRead, markAllNotificationsRead, currentUser, isLoading } = useAppData();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || !currentUser) return null;

  const signedSOPCount = sops.filter((s) => s.signedOffBy.includes(user.id)).length;
  const pendingReviewsCount = submissions.filter((s) => s.status === 'pending_review').length;
  const nextPendingSOP = sops.find((s) => !s.signedOffBy.includes(user.id));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) return;
    const lower = query.toLowerCase();
    const isStaff = user.role !== 'employee';
    if (lower.startsWith('sop') || lower.includes('checklist')) {
      navigate(isStaff ? '/admin/sops' : '/employee/sops');
    } else if (lower.includes('grade') || lower.includes('review') || lower.includes('submission')) {
      navigate(isStaff ? '/admin/submissions' : '/employee/submissions');
    } else if (lower.includes('employee') || lower.includes('trainee')) {
      navigate('/admin/employees');
    } else if (lower.includes('edit') || lower.includes('youtube') || lower.includes('marketing') || lower.includes('course')) {
      navigate(isStaff ? '/admin/courses' : '/employee/courses');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar
        currentUser={currentUser}
        notifications={notifications}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllNotificationsRead={markAllNotificationsRead}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentRole={user.role}
          pendingReviewsCount={pendingReviewsCount}
          signedSOPCount={signedSOPCount}
          totalSOPCount={sops.length}
          nextPendingSOP={nextPendingSOP}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-950">
          <Suspense fallback={<PageLoadingFallback />}>
            {isLoading ? <PageLoadingFallback /> : <Outlet />}
          </Suspense>
        </main>
      </div>
    </div>
  );
};
