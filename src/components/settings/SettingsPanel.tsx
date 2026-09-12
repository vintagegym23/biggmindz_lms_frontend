import React, { useState } from 'react';
import { User as UserIcon, Lock, Bell, Settings as SettingsIcon } from 'lucide-react';
import { User } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { extractErrorMessage } from '../../api/client';

interface SettingsPanelProps {
  currentUser: User;
}

type Tab = 'profile' | 'security' | 'notifications';

const NOTIFICATION_PREFS = [
  { key: 'courseAssignments', label: 'Course assignments' },
  { key: 'tutorFeedback', label: 'Tutor feedback' },
  { key: 'revisionRequests', label: 'Revision requests' },
  { key: 'courseReminders', label: 'Course reminders' },
  { key: 'trainingCompletion', label: 'Training completion' }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ currentUser }) => {
  const { showToast } = useToast();
  const { refetchUser } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, true]))
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await userApi.updateProfile({ name, email, department });
      await refetchUser();
      showToast('Profile updated successfully.');
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    setIsChangingPassword(true);
    try {
      await userApi.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password changed successfully.');
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await userApi.updateNotificationPreferences(prefs);
      showToast('Notification preferences saved.');
    } catch (err) {
      showToast(extractErrorMessage(err), 'error');
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <SettingsIcon className="h-4 w-4" />
          <span>Account Settings</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                tab === t.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div className="flex items-center gap-4">
            <img src={currentUser.avatar} alt={currentUser.name} className="h-16 w-16 rounded-full border border-slate-700 object-cover" />
            <div>
              <button type="button" onClick={() => showToast('Photo upload is simulated in this MVP.', 'info')} className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200">
                Change Photo
              </button>
              <p className="text-[11px] text-slate-500 mt-1">JPG or PNG, up to 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Role</label>
              <input
                type="text"
                value={currentUser.role}
                disabled
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-500 capitalize cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button type="submit" disabled={isSavingProfile} className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20">
              {isSavingProfile ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {tab === 'security' && (
        <form onSubmit={handleChangePassword} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Change Password</h3>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button type="submit" disabled={isChangingPassword} className="rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20">
              {isChangingPassword ? 'Updating…' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {tab === 'notifications' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Notification Preferences</h3>
          <div className="space-y-3">
            {NOTIFICATION_PREFS.map((pref) => (
              <label key={pref.key} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                <span className="text-xs font-semibold text-slate-200">{pref.label}</span>
                <input
                  type="checkbox"
                  checked={prefs[pref.key]}
                  onChange={() => setPrefs((prev) => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                  className="h-4 w-4 accent-amber-500"
                />
              </label>
            ))}
          </div>
          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button onClick={handleSaveNotifications} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20">
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
