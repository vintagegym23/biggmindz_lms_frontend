import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, GripVertical } from 'lucide-react';
import { CourseModule, LessonUpdateInput } from '../../types';
import { LessonItem } from './LessonItem';

interface ModuleAccordionProps {
  module: CourseModule;
  onUpdateModule: (updates: Partial<CourseModule>) => void;
  onDeleteModule: () => void;
  onAddLesson: (title: string) => void;
  onUpdateLesson: (lessonId: string, updates: LessonUpdateInput) => void;
  onDeleteLesson: (lessonId: string) => void;
  onReorderLessons: (lessonIds: string[]) => void;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  module,
  onUpdateModule,
  onDeleteModule,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onReorderLessons
}) => {
  const [expanded, setExpanded] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(module.title);
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const moveLesson = (lessonId: string, direction: 'up' | 'down') => {
    const ids = module.lessons.map((l) => l.id);
    const idx = ids.indexOf(lessonId);
    const swapWith = direction === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= ids.length) return;
    [ids[idx], ids[swapWith]] = [ids[swapWith], ids[idx]];
    onReorderLessons(ids);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <button onClick={() => setExpanded((s) => !s)} className="flex items-center gap-2 flex-1 min-w-0 text-left">
          <GripVertical className="h-4 w-4 text-slate-600 flex-shrink-0" />
          {expanded ? <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />}
          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={() => { onUpdateModule({ title: titleDraft }); setEditingTitle(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { onUpdateModule({ title: titleDraft }); setEditingTitle(false); } }}
              className="rounded-lg border border-amber-500/50 bg-slate-950 px-2 py-1 text-sm font-bold text-white flex-1 min-w-0"
            />
          ) : (
            <h3
              onClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}
              className="text-sm font-bold text-white truncate hover:text-amber-400"
            >
              {module.title}
            </h3>
          )}
        </button>
        <span className="text-[11px] text-slate-500 flex-shrink-0">{module.lessons.length} lessons</span>
        <button onClick={onDeleteModule} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {module.lessons.map((lesson, idx) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isFirst={idx === 0}
              isLast={idx === module.lessons.length - 1}
              onUpdate={(updates) => onUpdateLesson(lesson.id, updates)}
              onDelete={() => onDeleteLesson(lesson.id)}
              onMove={(direction) => moveLesson(lesson.id, direction)}
            />
          ))}

          <div className="flex items-center gap-2 pt-1">
            <input
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newLessonTitle.trim()) {
                  onAddLesson(newLessonTitle.trim());
                  setNewLessonTitle('');
                }
              }}
              placeholder="New lesson title..."
              className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (!newLessonTitle.trim()) return;
                onAddLesson(newLessonTitle.trim());
                setNewLessonTitle('');
              }}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-amber-400"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Lesson</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
