import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Film, Upload } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { SubmissionStatusBadge } from '../../components/common/SubmissionStatusBadge';
import { submissionService } from '../../services/submissionService';

export const EmployeeSubmissionDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams<{ submissionId: string }>();
  const { currentUser, submissions } = useAppData();

  const submission = submissions.find((s) => s.id === submissionId);

  if (!currentUser) return null;

  if (!submission) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Submission not found</h2>
        <button
          onClick={() => navigate('/employee/submissions')}
          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold"
        >
          Back to My Submissions
        </button>
      </div>
    );
  }

  const history = submissionService.getVersionHistory(submissions, submission.assignmentId, submission.userId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/employee/submissions')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to My Submissions</span>
      </button>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase">{submission.courseTitle}</span>
            <h1 className="text-xl font-bold text-white mt-1">{submission.assignmentTitle}</h1>
            <p className="text-xs text-slate-400 mt-1">Submitted {submission.submittedAt}</p>
          </div>
          <SubmissionStatusBadge status={submission.status} />
        </div>

        <a
          href={submission.projectUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2"
        >
          <span className="truncate max-w-xs">{submission.projectUrl}</span>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
        </a>

        {submission.notes && (
          <div className="text-xs text-slate-400 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            Your notes: "{submission.notes}"
          </div>
        )}
      </div>

      {submission.review ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <img
                src={submission.review.reviewerAvatar}
                alt={submission.review.reviewerName}
                className="h-10 w-10 rounded-full border border-slate-700 object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-white">Review by {submission.review.reviewerName}</h4>
                <p className="text-xs text-slate-400">{submission.review.reviewedAt}</p>
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">{submission.review.score}/100</div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
            "{submission.review.generalNotes}"
          </div>

          {submission.review.timestampFeedback && submission.review.timestampFeedback.length > 0 && (
            <div className="space-y-2 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Film className="h-3.5 w-3.5" />
                <span>Timecoded Timeline Comments</span>
              </h5>
              <div className="space-y-1.5">
                {submission.review.timestampFeedback.map((fb, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-800 bg-slate-950/50 text-xs">
                    <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {fb.timestamp}
                    </span>
                    <span className="text-slate-300">{fb.comment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 space-y-2">
          <h4 className="text-sm font-bold text-white">Awaiting tutor review</h4>
          <p className="text-xs text-slate-400">You'll get a notification and timecoded comments once graded.</p>
        </div>
      )}

      {history.length > 1 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Version History</h4>
          <div className="space-y-1.5">
            {history.map((v, idx) => (
              <div key={v.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono font-bold text-slate-300">v{idx + 1}</span>
                <SubmissionStatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {submission.status === 'needs_revision' && (
        <button
          onClick={() => navigate(`/employee/assignments/${submission.assignmentId}`)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 text-xs font-bold shadow-lg shadow-amber-500/20"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload New Version</span>
        </button>
      )}
    </div>
  );
};
