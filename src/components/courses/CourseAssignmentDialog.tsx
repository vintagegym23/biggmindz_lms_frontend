import React, { useState } from 'react';
import { X, Search, Send, CheckSquare, Square } from 'lucide-react';
import { TraineeProgress } from '../../types';

interface CourseAssignmentDialogProps {
  courseTitle: string;
  employees: TraineeProgress[];
  preselectedEmployeeIds?: string[];
  onClose: () => void;
  onAssign: (employeeIds: string[], dueDate: string) => void;
}

export const CourseAssignmentDialog: React.FC<CourseAssignmentDialogProps> = ({
  courseTitle,
  employees,
  preselectedEmployeeIds = [],
  onClose,
  onAssign
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set(preselectedEmployeeIds));
  const [dueDate, setDueDate] = useState('');

  const activeEmployees = employees.filter((e) => e.active !== false);
  const filtered = activeEmployees.filter(
    (e) => e.userName.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((e) => e.userId)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.size === 0 || !dueDate) return;
    onAssign(Array.from(selected), dueDate);
    onClose();
  };

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Assign Course</h2>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{courseTitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button type="button" onClick={toggleAll} className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300">
              {allSelected ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
              <span>Select All ({filtered.length})</span>
            </button>
            <span className="text-[11px] text-slate-500">{selected.size} selected</span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-xl border border-slate-800 bg-slate-950/40 p-2">
            {filtered.map((emp) => {
              const isChecked = selected.has(emp.userId);
              return (
                <label
                  key={emp.userId}
                  className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isChecked ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <input type="checkbox" checked={isChecked} onChange={() => toggle(emp.userId)} className="h-4 w-4 accent-amber-500" />
                  <img src={emp.userAvatar} alt={emp.userName} className="h-7 w-7 rounded-full object-cover border border-slate-700" />
                  <div className="text-xs">
                    <div className="font-bold text-slate-200">{emp.userName}</div>
                    <div className="text-[10px] text-slate-500">{emp.department}</div>
                  </div>
                </label>
              );
            })}
            {filtered.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No employees found.</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white">
              Cancel
            </button>
            <button
              type="submit"
              disabled={selected.size === 0 || !dueDate}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 px-5 py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Assign Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
