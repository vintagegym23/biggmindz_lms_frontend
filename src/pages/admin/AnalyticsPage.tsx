import React from 'react';
import { BarChart3, Users, Award, Clock } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { SimpleBarChart } from '../../components/charts/SimpleBarChart';

export const AnalyticsPage: React.FC = () => {
  const { employees, courses, submissions, assignments } = useAppData();

  const activeEmployees = employees.filter((e) => e.active !== false);
  const avgCompletion = Math.round(
    activeEmployees.reduce((acc, e) => acc + e.overallProgress, 0) / (activeEmployees.length || 1)
  );
  const coursesCompleted = activeEmployees.reduce((acc, e) => acc + e.completedCoursesCount, 0);
  const pendingAssignments = activeEmployees.reduce((acc, e) => acc + e.assignmentsPending, 0);

  const employeeProgressData = activeEmployees
    .slice()
    .sort((a, b) => b.overallProgress - a.overallProgress)
    .map((e) => ({ label: e.userName, value: e.overallProgress }));

  const courseAssignmentData = courses.map((c) => ({ label: c.title, value: c.assignedTo?.length ?? 0 }));

  const assignmentPerformanceData = assignments.map((a) => {
    const graded = submissions.filter((s) => s.assignmentId === a.id && s.review);
    const avgScore = graded.length
      ? Math.round(graded.reduce((sum, s) => sum + (s.review?.score ?? 0), 0) / graded.length)
      : 0;
    return { label: a.title, value: avgScore };
  });

  const statusCounts = {
    approved: submissions.filter((s) => s.status === 'approved').length,
    pending_review: submissions.filter((s) => s.status === 'pending_review').length,
    needs_revision: submissions.filter((s) => s.status === 'needs_revision').length
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
          <BarChart3 className="h-4 w-4" />
          <span>Training Analytics</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Aggregate view of employee progress, course reach, and review throughput.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Employees</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{activeEmployees.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Average Completion</span>
            <BarChart3 className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgCompletion}%</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Courses Completed</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{coursesCompleted}</div>
        </div>
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
            <span>Pending Assignments</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingAssignments}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Employee Progress</h3>
          <SimpleBarChart data={employeeProgressData} suffix="%" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Course Reach (Employees Assigned)</h3>
          <SimpleBarChart data={courseAssignmentData} color="bg-sky-400" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Assignment Performance (Avg Score)</h3>
          <SimpleBarChart data={assignmentPerformanceData} suffix="/100" color="bg-emerald-400" />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Training Activity (Submission Status)</h3>
          <SimpleBarChart
            data={[
              { label: 'Approved', value: statusCounts.approved },
              { label: 'In Review', value: statusCounts.pending_review },
              { label: 'Needs Revision', value: statusCounts.needs_revision }
            ]}
            color="bg-purple-400"
          />
        </div>
      </div>
    </div>
  );
};
