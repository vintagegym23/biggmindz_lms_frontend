import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, ExternalLink } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { SubmissionStatusBadge } from '../../components/common/SubmissionStatusBadge';
import { submissionService } from '../../services/submissionService';

export const EmployeeSubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, submissions } = useAppData();

  if (!currentUser) return null;

  const mySubmissions = submissionService.getSubmissionsForUser(submissions, currentUser.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileCheck2 className="h-4 w-4" />
            <span>Your Submission History</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">My Submissions</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track every deliverable you've submitted and its review status.
          </p>
        </div>
      </div>

      {mySubmissions.length === 0 ? (
        <div className="p-12 text-center border border-slate-800 rounded-2xl bg-slate-900/40 text-slate-400 space-y-2">
          <FileCheck2 className="h-8 w-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">No projects submitted yet</h4>
          <p className="text-xs text-slate-500">Head to Assignments to submit your first deliverable.</p>
          <button
            onClick={() => navigate('/employee/assignments')}
            className="mt-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold"
          >
            View Assignments
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3.5 pl-4">Assignment</th>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Submitted</th>
                  <th className="p-3.5">Tutor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mySubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 pl-4 font-bold text-white">{sub.assignmentTitle}</td>
                    <td className="p-3.5 text-slate-300">{sub.courseTitle}</td>
                    <td className="p-3.5 text-slate-400">{sub.submittedAt}</td>
                    <td className="p-3.5 text-slate-400">{sub.review?.reviewerName || '—'}</td>
                    <td className="p-3.5">
                      <SubmissionStatusBadge status={sub.status} />
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={sub.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-white"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={() => navigate(`/employee/submissions/${sub.id}`)}
                          className="text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          View →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
