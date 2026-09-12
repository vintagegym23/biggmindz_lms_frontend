import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User, Notification } from '../../types';
import { authService } from '../../services/authService';
import logo from '../../images/biggminds logo.png';

interface NavbarProps {
  currentUser: User;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onOpenMobileNav: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onSearch,
  searchQuery,
  onOpenMobileNav,
  onLogout
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">

        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileNav}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white flex-shrink-0"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(authService.getDefaultRouteForRole(currentUser.role))}
            className="flex items-center gap-3 text-left focus:outline-none group"
            id="brand-logo-btn"
          >
            <img
              src={logo}
              alt="BiggMinds Solutions"
              className="h-10 w-auto rounded-lg shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  BiggMinds
                </span>
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                  Academy
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                BiggMinds Solutions Internal LMS
              </p>
            </div>
          </button>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search courses, SOPs (e.g. SOP-VID-01), lessons..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Notifications & User Profile */}
        <div className="flex items-center gap-3">

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => {
                setShowNotifications((s) => !s);
                setShowUserMenu(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-400">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={onMarkAllNotificationsRead} className="text-[11px] text-amber-400 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto mt-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        onMarkNotificationRead(item.id);
                        navigate(item.targetPath);
                        setShowNotifications(false);
                      }}
                      className={`py-2.5 px-2 rounded-lg cursor-pointer hover:bg-slate-800/80 transition-colors ${
                        item.unread ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                        <span className="text-[10px] text-slate-500">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              id="user-menu-btn"
              onClick={() => {
                setShowUserMenu((s) => !s);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 sm:border-l border-slate-800"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-8 w-8 rounded-full border border-slate-700 object-cover"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px] capitalize">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="hidden lg:block h-3.5 w-3.5 text-slate-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2.5 py-2 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate(currentUser.role === 'employee' ? '/employee/settings' : '/admin/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
