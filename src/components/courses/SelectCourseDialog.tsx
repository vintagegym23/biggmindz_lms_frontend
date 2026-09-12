import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { Course } from '../../types';

interface SelectCourseDialogProps {
  courses: Course[];
  onClose: () => void;
  onSelect: (course: Course) => void;
}

export const SelectCourseDialog: React.FC<SelectCourseDialogProps> = ({ courses, onClose, onSelect }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Choose a course to assign</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c)}
              className="w-full text-left p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:border-amber-500/50 hover:bg-slate-900 transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-200">{c.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{c.category.replace('_', ' ')} • {c.level}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
