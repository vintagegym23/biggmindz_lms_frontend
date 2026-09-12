import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Eye, Rocket, Users } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { CourseSettingsForm } from '../../components/courses/CourseSettingsForm';
import { ModuleAccordion } from '../../components/courses/ModuleAccordion';
import { CourseAssignmentDialog } from '../../components/courses/CourseAssignmentDialog';
import { PageLoadingFallback } from '../../components/common/PageLoadingFallback';
import { courseApi } from '../../api/courseApi';
import { extractErrorMessage } from '../../api/client';
import { Course } from '../../types';

const blankCourse = (): Course => ({
  id: '',
  title: 'Untitled Course',
  slug: '',
  category: 'video_editing',
  level: 'Beginner',
  durationHours: 0,
  totalLessons: 0,
  thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
  instructor: { name: '', role: '', avatar: '' },
  summary: '',
  objectives: [],
  modules: [],
  software: [],
  sopsReferenced: [],
  status: 'draft',
  assignedTo: []
});

export const CourseBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { employees, deleteCourse, setCourseStatus, assignCourseToEmployees, refreshCourses } = useAppData();
  const { showToast } = useToast();

  const isNew = courseId === 'new';
  const [draft, setDraft] = useState<Course>(blankCourse);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [notFound, setNotFound] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const creationInFlight = useRef<Promise<string> | null>(null);
  const createdIdRef = useRef<string>('');
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    if (isNew || !courseId) return;
    let cancelled = false;
    courseApi
      .getById(courseId, false)
      .then((c) => !cancelled && setDraft(c))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [courseId, isNew]);

  const refetchDraft = useCallback(async (id: string) => {
    const fresh = await courseApi.getById(id, false);
    setDraft(fresh);
  }, []);

  if (isLoading) return <PageLoadingFallback />;

  if (notFound || (!isNew && !draft.id)) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Course not found</h2>
        <button onClick={() => navigate('/admin/courses')} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold">
          Back to Courses
        </button>
      </div>
    );
  }

  const runMutation = async (fn: () => Promise<void>, errorMessage = 'That action failed.') => {
    try {
      await fn();
    } catch (err) {
      showToast(extractErrorMessage(err) || errorMessage, 'error');
    }
  };

  /**
   * New courses have no id yet — the first settings edit creates them for
   * real. `creationInFlight` makes this single-flight: rapid keystrokes
   * before the first create() resolves all await the SAME request instead
   * of each firing their own POST (which would create duplicate drafts).
   */
  const ensureCourseExists = async (initial: Partial<Course>): Promise<string> => {
    if (draft.id || createdIdRef.current) return draft.id || createdIdRef.current;
    if (!creationInFlight.current) {
      creationInFlight.current = courseApi.create({ ...draft, ...initial }).then(async (created) => {
        createdIdRef.current = created.id;
        navigate(`/admin/courses/${created.id}`, { replace: true });

        // Reconcile any edits typed while the create() call was in flight —
        // draftRef always reflects the latest local state, including
        // keystrokes that arrived after this request was sent.
        const latest = draftRef.current;
        const editedDuringFlight =
          latest.title !== created.title ||
          latest.summary !== created.summary ||
          latest.category !== created.category ||
          latest.level !== created.level;

        const finalCourse = editedDuringFlight
          ? await courseApi.update(created.id, {
              title: latest.title,
              summary: latest.summary,
              category: latest.category,
              level: latest.level,
              software: latest.software
            })
          : created;

        setDraft(finalCourse);
        return created.id;
      });
    }
    return creationInFlight.current;
  };

  const handleSettingsChange = (updates: Partial<Course>) => {
    const wasNew = !draft.id && !createdIdRef.current;
    setDraft((prev) => ({ ...prev, ...updates }));
    runMutation(async () => {
      const id = await ensureCourseExists(updates);
      if (!wasNew) {
        const updated = await courseApi.update(id, updates);
        setDraft(updated);
      }
    }, 'Could not save course settings.');
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    const title = newModuleTitle.trim();
    setNewModuleTitle('');
    runMutation(async () => {
      const id = await ensureCourseExists({});
      await courseApi.addModule(id, title);
      await refetchDraft(id);
    }, 'Could not add module.');
  };

  const handlePublishToggle = () => {
    runMutation(async () => {
      const nextStatus = (draft.status ?? 'draft') === 'published' ? 'draft' : 'published';
      const updated = await setCourseStatus(draft.id, nextStatus);
      setDraft(updated);
      showToast(nextStatus === 'published' ? 'Course published — visible to assigned employees.' : 'Course moved back to draft.');
    }, 'Could not change publish status.');
  };

  const totalLessons = draft.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button onClick={() => navigate('/admin/courses')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Courses</span>
        </button>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
            (draft.status ?? 'draft') === 'published'
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {(draft.status ?? 'draft') === 'published' ? 'Published' : 'Draft'}
          </span>
          <button
            disabled={!draft.id}
            onClick={() => window.open(`/employee/courses/${draft.id}`, '_blank')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 px-3 py-2 text-xs font-semibold text-slate-200"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
          <button
            disabled={!draft.id}
            onClick={() => setShowAssignDialog(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 px-3 py-2 text-xs font-semibold text-slate-200"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Assign ({draft.assignedTo?.length ?? 0})</span>
          </button>
          <button
            disabled={!draft.id}
            onClick={handlePublishToggle}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 px-4 py-2 text-xs font-bold shadow-md shadow-amber-500/20"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>{(draft.status ?? 'draft') === 'published' ? 'Unpublish' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <CourseSettingsForm course={draft} onChange={handleSettingsChange} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Course Structure ({draft.modules.length} modules, {totalLessons} lessons)</h3>
        </div>

        {!draft.id ? (
          <p className="text-xs text-slate-500 p-3 rounded-xl border border-dashed border-slate-800">
            Give the course a title above to start adding modules.
          </p>
        ) : (
          <div className="space-y-3">
            {draft.modules.map((module) => (
              <ModuleAccordion
                key={module.id}
                module={module}
                onUpdateModule={(updates) =>
                  runMutation(async () => {
                    await courseApi.updateModule(draft.id, module.id, updates);
                    await refetchDraft(draft.id);
                  }, 'Could not update module.')
                }
                onDeleteModule={() =>
                  runMutation(async () => {
                    await courseApi.deleteModule(draft.id, module.id);
                    await refetchDraft(draft.id);
                  }, 'Could not delete module.')
                }
                onAddLesson={(title) =>
                  runMutation(async () => {
                    await courseApi.addLesson(draft.id, module.id, title);
                    await refetchDraft(draft.id);
                  }, 'Could not add lesson.')
                }
                onUpdateLesson={(lessonId, updates) =>
                  runMutation(async () => {
                    await courseApi.updateLesson(lessonId, updates);
                    await refetchDraft(draft.id);
                  }, 'Could not update lesson.')
                }
                onDeleteLesson={(lessonId) =>
                  runMutation(async () => {
                    await courseApi.deleteLesson(lessonId);
                    await refetchDraft(draft.id);
                  }, 'Could not delete lesson.')
                }
                onReorderLessons={(lessonIds) =>
                  runMutation(async () => {
                    await courseApi.reorderLessons(draft.id, module.id, lessonIds);
                    await refetchDraft(draft.id);
                  }, 'Could not reorder lessons.')
                }
              />
            ))}

            <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-800">
              <input
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddModule()}
                placeholder="New module title (e.g. Module 3: Color Grading)..."
                className="flex-1 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={handleAddModule}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-bold text-amber-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Module</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {draft.id && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() =>
              runMutation(async () => {
                await deleteCourse(draft.id);
                showToast('Course deleted.', 'info');
                navigate('/admin/courses');
              }, 'Could not delete course.')
            }
            className="text-xs font-semibold text-red-400 hover:text-red-300"
          >
            Delete Course
          </button>
        </div>
      )}

      {showAssignDialog && (
        <CourseAssignmentDialog
          courseTitle={draft.title}
          employees={employees}
          preselectedEmployeeIds={draft.assignedTo?.map((a) => a.employeeId) ?? []}
          onClose={() => setShowAssignDialog(false)}
          onAssign={(employeeIds, dueDate) =>
            runMutation(async () => {
              const updated = await assignCourseToEmployees(draft.id, employeeIds, dueDate);
              setDraft(updated);
              showToast('Course assigned successfully.');
            }, 'Could not assign course.')
          }
        />
      )}
    </div>
  );
};
