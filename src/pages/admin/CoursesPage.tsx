import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FolderGit2 } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { CourseCard } from '../../components/courses/CourseCard';
import { CourseAssignmentDialog } from '../../components/courses/CourseAssignmentDialog';
import { extractErrorMessage } from '../../api/client';
import { Course } from '../../types';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'company_sops', label: 'Company SOPs' },
  { id: 'video_editing', label: 'Video Editing' },
  { id: 'advanced_video_editing', label: 'Advanced Editing' },
  { id: 'youtube_marketing', label: 'YouTube Marketing' },
  { id: 'digital_marketing', label: 'Digital Marketing' },
  { id: 'social_media', label: 'Social Media' },
  { id: 'creative_workflows', label: 'Creative Workflows' }
];

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, employees, duplicateCourse, setCourseStatus, assignCourseToEmployees } = useAppData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [assignCourseTarget, setAssignCourseTarget] = useState<Course | null>(null);

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'all' || c.category === category;
    const courseStatus = c.status ?? 'published';
    const matchStatus = status === 'all' || courseStatus === status;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderGit2 className="h-4 w-4" />
            <span>Curriculum Manager</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">Courses</h1>
          <p className="text-sm text-slate-400 mt-1">Create, edit, and assign BiggMinds training curricula.</p>
        </div>
        <button
          onClick={() => navigate('/admin/courses/new')}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Create Course</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 space-y-2">
          <FolderGit2 className="h-8 w-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No courses found</h4>
          <p className="text-xs text-slate-500">Try adjusting your filters, or create a new curriculum.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onOpen={() => navigate(`/admin/courses/${course.id}`)}
              onDuplicate={async () => {
                try {
                  await duplicateCourse(course.id);
                  showToast('Course duplicated as a new draft.');
                } catch (err) {
                  showToast(extractErrorMessage(err), 'error');
                }
              }}
              onArchive={async () => {
                try {
                  await setCourseStatus(course.id, course.status === 'draft' ? 'published' : 'draft');
                  showToast(course.status === 'draft' ? 'Course published.' : 'Course archived to draft.');
                } catch (err) {
                  showToast(extractErrorMessage(err), 'error');
                }
              }}
              onAssign={() => setAssignCourseTarget(course)}
            />
          ))}
        </div>
      )}

      {assignCourseTarget && (
        <CourseAssignmentDialog
          courseTitle={assignCourseTarget.title}
          employees={employees}
          preselectedEmployeeIds={assignCourseTarget.assignedTo?.map((a) => a.employeeId) ?? []}
          onClose={() => setAssignCourseTarget(null)}
          onAssign={async (employeeIds, dueDate) => {
            try {
              await assignCourseToEmployees(assignCourseTarget.id, employeeIds, dueDate);
              showToast('Course assigned successfully.');
            } catch (err) {
              showToast(extractErrorMessage(err), 'error');
            }
          }}
        />
      )}
    </div>
  );
};
