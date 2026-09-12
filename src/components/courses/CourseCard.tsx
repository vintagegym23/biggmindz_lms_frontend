import React, { useState } from 'react';
import { Clock, Layers, MoreVertical, Users, CheckCircle2 } from 'lucide-react';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onOpen: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onAssign: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onOpen, onDuplicate, onArchive, onAssign }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isPublished = (course.status ?? 'published') === 'published';

  return (
    <div className="group rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden hover:border-amber-500/50 hover:bg-slate-900 transition-all flex flex-col">
      <div className="relative h-36 w-full overflow-hidden bg-slate-800">
        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 left-2">
          <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold backdrop-blur-md border ${
            isPublished ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-slate-950/80 text-slate-400 border-slate-600'
          }`}>
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu((s) => !s); }}
            className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-950/70 backdrop-blur text-slate-300 hover:text-white"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl z-20 p-1.5 text-left">
              <button onClick={() => { setShowMenu(false); onAssign(); }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-1.5">
                <Users className="h-3 w-3" /> Assign
              </button>
              <button onClick={() => { setShowMenu(false); onDuplicate(); }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white">
                Duplicate
              </button>
              <button onClick={() => { setShowMenu(false); onArchive(); }} className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-red-400 hover:bg-red-500/10">
                Archive
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2 flex-1 cursor-pointer" onClick={onOpen}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">{course.category.replace('_', ' ')}</span>
        <h3 className="font-heading text-sm font-bold text-white leading-snug line-clamp-2">{course.title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.durationHours.toFixed(1)}h</span>
          <span className="flex items-center gap-1"><Layers className="h-3 w-3" /> {course.modules.length} modules</span>
          {course.assignedTo && course.assignedTo.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> {course.assignedTo.length} assigned</span>
          )}
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={onOpen}
          className="w-full rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 py-2 text-xs font-bold transition-colors"
        >
          Manage Course
        </button>
      </div>
    </div>
  );
};
