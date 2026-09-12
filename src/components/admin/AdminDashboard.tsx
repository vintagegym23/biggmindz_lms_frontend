import React from 'react';
import { 
  Users, 
  BarChart3, 
  Clock, 
  FileCheck2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Film,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { TraineeProgress, Submission, Course, SOPDocument, User } from '../../types';

interface AdminDashboardProps {
  currentAdmin: User;
  trainees: TraineeProgress[];
  submissions: Submission[];
  courses: Course[];
  sops: SOPDocument[];
  onOpenReviewModal: (submission: Submission) => void;
  onNavigateTo: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentAdmin,
  trainees,
  submissions,
  courses,
  sops,
  onOpenReviewModal,
  onNavigateTo
}) => {
  const pendingSubmissions = submissions.filter(s => s.status === 'pending_review');
  const totalSubmissions = submissions.length;
  const avgCompletion = Math.round(
    trainees.reduce((acc, t) => acc + t.overallProgress, 0) / (trainees.length || 1)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Tutor Operations & Quality Command</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Academy Overview & Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Oversee BiggMinds onboarding velocity, grade creative cuts, and enforce SOP compliance.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTo('admin-courses')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Curriculum Manager</span>
          </button>
          <button
            onClick={() => onNavigateTo('admin-reviews')}
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Review Desk ({pendingSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Active Trainees</span>
            <Users className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{trainees.length}</div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <span>+2 interns joined this month</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Avg Curriculum Progress</span>
            <BarChart3 className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgCompletion}%</div>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
            <div className="bg-sky-400 h-full" style={{ width: `${avgCompletion}%` }} />
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase">
            <span>Submissions in Queue</span>
            <Clock className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">{pendingSubmissions.length}</div>
          <p className="text-[11px] text-slate-400">
            {pendingSubmissions.length > 0 ? 'Requires tutor grading & timecoded notes' : 'All cuts reviewed'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>SOP Compliance Rate</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">94%</div>
          <p className="text-[11px] text-slate-400">
            {sops.length} active standard operating procedures
          </p>
        </div>

      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Trainee Matrix Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-white">Trainee Progress Matrix</h2>
              <p className="text-xs text-slate-400">Live pacing, completion, and performance index</p>
            </div>
            <button
              onClick={() => onNavigateTo('admin-trainees')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              Detailed matrix
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-4">Learner</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Curriculum</th>
                    <th className="p-3.5">Quiz Avg</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {trainees.map((trainee) => (
                    <tr key={trainee.userId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={trainee.userAvatar}
                            alt={trainee.userName}
                            className="h-7 w-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white leading-tight">{trainee.userName}</div>
                            <div className="text-[10px] text-slate-500">{trainee.lastActive}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        {trainee.department}
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1 w-24">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>{trainee.overallProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{ width: `${trainee.overallProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-slate-200">
                        {trainee.quizAverage}%
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          trainee.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : trainee.status === 'on_track'
                              ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {trainee.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 pr-4 text-right">
                        <button
                          onClick={() => onNavigateTo('admin-trainees')}
                          className="text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Pending Submissions Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-white">Pending Review Queue</h3>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {pendingSubmissions.length} waiting
            </span>
          </div>

          <div className="space-y-3">
            {pendingSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sub.userAvatar}
                      alt={sub.userName}
                      className="h-8 w-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{sub.userName}</h4>
                      <p className="text-[10px] text-slate-400">{sub.userDepartment}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{sub.submittedAt}</span>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-200">{sub.assignmentTitle}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{sub.courseTitle}</p>
                </div>

                {sub.notes && (
                  <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded border border-slate-800 line-clamp-2">
                    "{sub.notes}"
                  </p>
                )}

                <button
                  id={`review-sub-btn-${sub.id}`}
                  onClick={() => onOpenReviewModal(sub)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 text-xs font-bold shadow-md shadow-amber-500/10 transition-colors"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  <span>Open Grading Desk</span>
                </button>
              </div>
            ))}

            {pendingSubmissions.length === 0 && (
              <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
                <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">Review queue is empty!</h4>
                <p className="text-[11px] text-slate-500">All submitted trainee cuts have been graded.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
