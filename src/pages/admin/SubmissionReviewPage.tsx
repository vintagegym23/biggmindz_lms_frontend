import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VideoReviewWorkspace } from '../../components/admin/VideoReviewWorkspace';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { submissionService } from '../../services/submissionService';
import { extractErrorMessage } from '../../api/client';

export const SubmissionReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { submissionId } = useParams<{ submissionId: string }>();
  const { currentUser, submissions, submitReview } = useAppData();
  const { showToast } = useToast();

  const submission = submissions.find((s) => s.id === submissionId);

  if (!currentUser) return null;

  if (!submission) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Submission not found</h2>
        <button onClick={() => navigate('/admin/submissions')} className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold">
          Back to Submissions
        </button>
      </div>
    );
  }

  const versionHistory = submissionService.getVersionHistory(submissions, submission.assignmentId, submission.userId);

  return (
    <VideoReviewWorkspace
      submission={submission}
      versionHistory={versionHistory}
      currentReviewer={currentUser}
      onBack={() => navigate('/admin/submissions')}
      onSubmitReview={async (submissionId, review) => {
        try {
          await submitReview(submissionId, review);
          showToast(review.passed ? 'Submission approved and employee notified.' : 'Revision requested — employee notified.');
          navigate('/admin/submissions');
        } catch (err) {
          showToast(extractErrorMessage(err), 'error');
        }
      }}
    />
  );
};
