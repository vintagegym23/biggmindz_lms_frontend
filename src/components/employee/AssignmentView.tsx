import React, { useState } from 'react';
import { 
  FileCheck2, 
  Clock, 
  Upload, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Film, 
  Award, 
  Sparkles,
  Send
} from 'lucide-react';
import { Assignment, Submission, User } from '../../types';

export interface NewSubmissionInput {
  assignmentId: string;
  projectUrl: string;
  notes: string;
  softwareUsed: string;
}

interface AssignmentViewProps {
  assignments: Assignment[];
  submissions: Submission[];
  currentUser: User;
  onNewSubmission: (input: NewSubmissionInput) => Promise<unknown>;
  selectedAssignmentId?: string;
}

export const AssignmentView: React.FC<AssignmentViewProps> = ({
  assignments,
  submissions,
  currentUser,
  onNewSubmission,
  selectedAssignmentId
}) => {
  const [activeAssignment, setActiveAssignment] = useState<Assignment>(() => {
    if (selectedAssignmentId) {
      const found = assignments.find(a => a.id === selectedAssignmentId);
      if (found) return found;
    }
    return assignments[0];
  });

  const [projectUrl, setProjectUrl] = useState('');
  const [softwareUsed, setSoftwareUsed] = useState('Adobe Premiere Pro 2026');
  const [notes, setNotes] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Find existing submission for active assignment
  const currentSubmission = submissions.find(
    s => s.assignmentId === activeAssignment.id && s.userId === currentUser.id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectUrl.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onNewSubmission({
        assignmentId: activeAssignment.id,
        projectUrl: projectUrl.trim(),
        notes: notes.trim(),
        softwareUsed
      });
      setIsSubmittedSuccess(true);
      setProjectUrl('');
      setNotes('');
      setTimeout(() => setIsSubmittedSuccess(false), 4000);
    } catch {
      setSubmitError('Could not submit your project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="h-4 w-4" />
            <span>Practical Work Submissions</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Assignments & Project Reviews
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit your client cuts, Frame.io review links, and inspect frame-by-frame tutor feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
            Total Submissions: <strong className="text-white">{submissions.length}</strong>
          </span>
        </div>
      </div>

      {/* Grid: Assignments list on left, details and submission desk on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Assignment List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            All Course Assignments
          </h3>

          {assignments.map((assign) => {
            const isSelected = activeAssignment.id === assign.id;
            const sub = submissions.find(s => s.assignmentId === assign.id && s.userId === currentUser.id);
            return (
              <div
                key={assign.id}
                onClick={() => setActiveAssignment(assign)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'border-amber-500/80 bg-slate-900 shadow-md shadow-amber-500/5'
                    : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-amber-400">
                    Due {assign.dueDate}
                  </span>
                  {sub?.status === 'approved' ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle className="h-3 w-3" /> Graded ({sub.review?.score}/100)
                    </span>
                  ) : sub?.status === 'pending_review' ? (
                    <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <Clock className="h-3 w-3" /> In Review
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                      Not Submitted
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">
                  {assign.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {assign.courseTitle}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right: Active Assignment Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Brief Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                {activeAssignment.courseTitle}
              </span>
              <h2 className="text-xl font-bold text-white">
                {activeAssignment.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Deadline: <strong className="text-slate-200">{activeAssignment.dueDate}</strong></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeAssignment.description}
            </p>

            {/* Rubric */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evaluation Rubric (100 Points Total)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeAssignment.rubric.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{item.criteria}</span>
                    <span className="font-mono font-bold text-amber-400 ml-2">{item.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* If already submitted and reviewed: Show Tutor Feedback */}
          {currentSubmission?.review && (
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={currentSubmission.review.reviewerAvatar}
                    alt={currentSubmission.review.reviewerName}
                    className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        Review by {currentSubmission.review.reviewerName}
                      </h4>
                      <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        Official Grade
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{currentSubmission.review.reviewedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400 font-mono">
                      {currentSubmission.review.score}/100
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Passing Grade (80+)</div>
                  </div>
                </div>
              </div>

              {/* General feedback message */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                "{currentSubmission.review.generalNotes}"
              </div>

              {/* Frame-by-frame / timestamp comments */}
              {currentSubmission.review.timestampFeedback && (
                <div className="space-y-2 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Film className="h-3.5 w-3.5" />
                    <span>Timecoded Timeline Comments</span>
                  </h5>
                  <div className="space-y-1.5">
                    {currentSubmission.review.timestampFeedback.map((fb, idx) => (
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

              <div className="pt-2">
                <a
                  href={currentSubmission.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <span>View your submitted cut: {currentSubmission.projectUrl}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          {/* If already submitted but pending review */}
          {currentSubmission && !currentSubmission.review && (
            <div className="rounded-2xl border border-amber-500/30 bg-slate-900/60 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
                <Clock className="h-4 w-4" />
                <span>Under Review by BiggMinds Tutor</span>
              </div>
              <h4 className="text-sm font-bold text-white">Your submission is in the review queue.</h4>
              <p className="text-xs text-slate-400">
                Submitted on {currentSubmission.submittedAt}. You will receive a notification and timecoded comments once graded.
              </p>
              <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300">
                Link: {currentSubmission.projectUrl}
              </div>
            </div>
          )}

          {/* Submission Form (if not submitted or submitting new revision) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Upload className="h-4 w-4 text-amber-400" />
              <span>{currentSubmission ? 'Submit New Iteration / Revision' : 'Submit Your Project'}</span>
            </div>

            {isSubmittedSuccess && (
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Project submitted successfully to the BiggMinds Tutor Desk!</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Deliverable URL (Frame.io Review Link, Google Drive, or Loom) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://app.frame.io/r/... or https://drive.google.com/..."
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Software Used
                </label>
                <select
                  value={softwareUsed}
                  onChange={(e) => setSoftwareUsed(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  <option>Adobe Premiere Pro 2026</option>
                  <option>Adobe After Effects</option>
                  <option>DaVinci Resolve Studio</option>
                  <option>Photoshop + Midjourney</option>
                  <option>CapCut Desktop Pro</option>
                  <option>Meta Ads Manager / Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Production Notes & Pacing Strategy
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly explain your hook decisions, sound design layering, and how you followed SOP-VID-01..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="submit-assignment-btn"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 px-6 py-3 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Submitting…' : 'Submit Deliverable for Review'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
