import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Search,
  Filter,
  Film
} from 'lucide-react';
import { Submission, User } from '../../types';

interface ReviewsDeskProps {
  submissions: Submission[];
  currentAdmin: User;
  onOpenReviewModal: (submission: Submission) => void;
}

export const ReviewsDesk: React.FC<ReviewsDeskProps> = ({
  submissions,
  currentAdmin,
  onOpenReviewModal
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'graded'>('pending');
  const [search, setSearch] = useState('');

  const filtered = submissions.filter((s) => {
    const isTabMatch = activeTab === 'pending' ? s.status === 'pending_review' : s.status !== 'pending_review';
    const isSearchMatch = s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      s.courseTitle.toLowerCase().includes(search.toLowerCase());
    return isTabMatch && isSearchMatch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="h-4 w-4" />
            <span>Tutor Grading Station</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Assignment & Cut Review Desk
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluate trainee milestone submissions, Frame.io review cuts, and provide timecoded timeline notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by trainee or project..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Pending Evaluation</span>
          <span className="bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px]">
            {submissions.filter(s => s.status === 'pending_review').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('graded')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === 'graded'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Graded & Archived</span>
          <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full text-[10px]">
            {submissions.filter(s => s.status !== 'pending_review').length}
          </span>
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filtered.map((sub) => (
          <div
            key={sub.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={sub.userAvatar}
                  alt={sub.userName}
                  className="h-10 w-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{sub.userName}</h3>
                    <span className="text-xs text-slate-400">• {sub.userDepartment}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submitted <strong className="text-slate-300">{sub.submittedAt}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {sub.review ? (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Score: {sub.review.score}/100
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    Awaiting Review
                  </span>
                )}

                <a
                  href={sub.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <span>Open Deliverable Cut</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={() => onOpenReviewModal(sub)}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-1.5 text-xs font-bold shadow transition-colors"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  <span>{sub.review ? 'Update Grade' : 'Grade Submission'}</span>
                </button>
              </div>
            </div>

            {/* Submission metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 font-semibold block">Assignment:</span>
                <span className="text-slate-200 font-bold">{sub.assignmentTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Course:</span>
                <span className="text-slate-300">{sub.courseTitle}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Software Declared:</span>
                <span className="font-mono text-slate-300">{sub.softwareUsed}</span>
              </div>
            </div>

            {/* Notes & feedback */}
            {sub.notes && (
              <div className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                Trainee Notes: "{sub.notes}"
              </div>
            )}

            {sub.review && (
              <div className="text-xs text-emerald-300/90 bg-emerald-950/15 p-3 rounded-xl border border-emerald-500/20">
                Tutor Feedback: "{sub.review.generalNotes}"
              </div>
            )}

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 space-y-2">
            <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">No submissions found</h4>
            <p className="text-xs text-slate-500">All submissions in this category are up to date.</p>
          </div>
        )}
      </div>

    </div>
  );
};
