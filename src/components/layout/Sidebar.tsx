import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FileCheck2,
  Award,
  Users,
  BarChart3,
  ClipboardCheck,
  FolderGit2,
  Radio,
  Settings,
  Sparkles,
  X
} from 'lucide-react';
import { Role, SOPDocument } from '../../types';
import { isStaffRole } from '../../utils/role';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface SidebarProps {
  currentRole: Role;
  pendingReviewsCount?: number;
  signedSOPCount?: number;
  totalSOPCount?: number;
  nextPendingSOP?: SOPDocument;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  pendingReviewsCount = 0,
  signedSOPCount = 0,
  totalSOPCount = 0,
  nextPendingSOP,
  isMobileOpen,
  onCloseMobile
}) => {
  const employeeNavItems: NavItem[] = [
    { path: '/employee/dashboard', label: 'My Learning Hub', icon: LayoutDashboard },
    { path: '/employee/courses', label: 'Course Catalog', icon: BookOpen },
    { path: '/employee/sops', label: 'Company SOPs', icon: FileText, badge: `${signedSOPCount}/${totalSOPCount}` },
    { path: '/employee/assignments', label: 'Assignments', icon: FileCheck2 },
    { path: '/employee/submissions', label: 'My Submissions', icon: ClipboardCheck },
    { path: '/employee/certificates', label: 'Certificates & Badges', icon: Award },
    { path: '/employee/cohorts', label: 'Live Cohort Reviews', icon: Radio },
    { path: '/employee/settings', label: 'Settings', icon: Settings }
  ];

  const adminNavItems: NavItem[] = [
    { path: '/admin/dashboard', label: 'Overview & Metrics', icon: BarChart3 },
    { path: '/admin/employees', label: 'Employees', icon: Users },
    {
      path: '/admin/submissions',
      label: 'Submissions',
      icon: ClipboardCheck,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount}` : undefined,
      badgeColor: 'bg-amber-500 text-slate-950'
    },
    { path: '/admin/courses', label: 'Courses', icon: FolderGit2 },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/sops', label: 'SOP Compliance', icon: FileText },
    { path: '/admin/cohorts', label: 'Live Cohort Sessions', icon: Radio },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const currentItems = isStaffRole(currentRole) ? adminNavItems : employeeNavItems;

  const content = (
    <div className="space-y-6">
      {/* Role Badge Indicator */}
      <div className="px-2 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full animate-pulse ${isStaffRole(currentRole) ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="text-xs font-semibold text-slate-300">
            {currentRole === 'admin' ? 'Admin Control' : currentRole === 'tutor' ? 'Tutor Control' : 'Learner Portal'}
          </span>
        </div>
        <button onClick={onCloseMobile} className="md:hidden text-slate-500 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation list */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          {isStaffRole(currentRole) ? 'Instructor Operations' : 'Training Roadmap'}
        </p>

        {currentItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* BiggMinds Solutions Company SOP Highlights */}
      {!isStaffRole(currentRole) && nextPendingSOP && (
        <div className="rounded-xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 to-slate-950 p-3.5 text-left">
          <div className="flex items-center gap-2 mb-2 text-amber-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Mandatory SOP</span>
          </div>
          <p className="text-xs font-bold text-slate-200 leading-snug">
            {nextPendingSOP.code}: {nextPendingSOP.title}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
            {nextPendingSOP.purpose}
          </p>
          <NavLink
            to={`/employee/sops?sop=${nextPendingSOP.id}`}
            onClick={onCloseMobile}
            className="mt-3 block w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-1.5 text-[11px] font-bold text-amber-300 border border-slate-700 transition-colors text-center"
          >
            Verify Checklist
          </NavLink>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4 min-h-[calc(100vh-4rem)] flex-col justify-between hidden md:flex">
        {content}
        <div className="pt-4 border-t border-slate-800/60 px-2">
          <div className="text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">BiggMinds Solutions</p>
            <p className="text-[10px] text-slate-500">Internal Training & QA Engine</p>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-slate-950 border-r border-slate-800 p-4 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-left">
            {content}
            <div className="pt-4 border-t border-slate-800/60 px-2">
              <div className="text-[11px] text-slate-400">
                <p className="font-semibold text-slate-300">BiggMinds Solutions</p>
                <p className="text-[10px] text-slate-500">Internal Training & QA Engine</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
