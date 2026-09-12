import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';

interface AddEmployeeDialogProps {
  onClose: () => void;
  onCreate: (input: { name: string; email: string; department: string; role: string; password: string }) => void;
}

export const AddEmployeeDialog: React.FC<AddEmployeeDialogProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Post-Production & Video Editing');
  const [role, setRole] = useState('Creative Intern');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    onCreate({ name: name.trim(), email: email.trim(), department, role, password });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Add Employee</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Priya Sharma"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@biggminds.com"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">Initial Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 pr-10 text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p className="text-[11px] text-red-400 mt-1">{passwordError}</p>}
            <p className="text-[10px] text-slate-500 mt-1">Share this with the employee securely — they can change it later in Settings.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Job Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 font-bold shadow-md shadow-amber-500/20">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
