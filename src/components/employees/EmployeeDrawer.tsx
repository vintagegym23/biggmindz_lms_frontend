import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Mail, Building2 } from 'lucide-react';
import { TraineeProgress, Course, SOPDocument, Submission } from '../../types';
import { SubmissionStatusBadge } from '../common/SubmissionStatusBadge';

interface EmployeeDrawerProps {
  employee: TraineeProgress;
  courses: Course[];
  sops: SOPDocument[];
  submissions: Submission[];
  initialTab?: 'profile' | 'courses' | 'progress' | 'submissions' | 'activity';
  onClose: () => void;
}

type Tab = 'profile' | 'courses' | 'progress' | 'submissions' | 'activity';

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({
  employee,
  courses,
  sops,
  submissions,
  initialTab = 'profile',
  onClose
}) => {
  const [tab, setTab] = useState<Tab>(initialTab);

  const assignedCourses = courses.filter((c) => c.assignedTo?.some((a) => a.employeeId === employee.userId));
  const employeeSubmissions = submissions.filter((s) => s.userId === employee.userId);
  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'courses', label: 'Assigned Courses' },
    { id: 'progress', label: 'Training Progress' },
    { id: 'submissions', label: 'Submissions' },
    { id: 'activity', label: 'Recent Activity' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto animate-in slide-in-from-right">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-5 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <img src={employee.userAvatar} alt={employee.userName} className="h-11 w-11 rounded-full border border-slate-700 object-cover" />
            <div>
              <h3 className="text-sm font-bold text-white">{employee.userName}</h3>
              <p className="text-[11px] text-slate-400">{employee.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-[11px] font-bold whitespace-nowrap rounded-t-lg transition-colors ${
                tab === t.id ? 'text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {tab === 'profile' && (
            <div className="space-y-3">
              {employee.active === false && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] font-semibold px-3 py-2">
                  This employee account is deactivated.
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span>{employee.email || `${employee.userName.toLowerCase().replace(/\s+/g, '.')}@biggminds.com`}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>{employee.department}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Overall Progress</div>
                  <div className="text-lg font-bold text-white font-mono">{employee.overallProgress}%</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Quiz Average</div>
                  <div className="text-lg font-bold text-amber-400 font-mono">{employee.quizAverage}%</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">Last active: <span className="text-slate-200">{employee.lastActive}</span></div>
            </div>
          )}

          {tab === 'courses' && (
            <div className="space-y-2">
              {assignedCourses.length === 0 && <p className="text-xs text-slate-500">No courses formally assigned yet.</p>}
              {assignedCourses.map((c) => {
                const assignment = c.assignedTo?.find((a) => a.employeeId === employee.userId);
                return (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/50">
                    <h4 className="text-xs font-bold text-slate-200">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Due {assignment?.dueDate}</p>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'progress' && (
            <div className="space-y-2">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${employee.overallProgress}%` }} />
              </div>
              <p className="text-xs text-slate-400">
                {employee.completedCoursesCount} of {employee.totalAssignedCount} courses completed
              </p>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">SOP Sign-Off Status</h4>
              <ul className="space-y-1.5 text-xs">
                {sops.map((sop) => {
                  const signed = sop.signedOffBy.includes(employee.userId);
                  return (
                    <li key={sop.id} className="flex items-center justify-between text-slate-300">
                      <span className="font-mono text-slate-400">{sop.code}</span>
                      {signed ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Signed</span>
                      ) : (
                        <span className="text-amber-400 font-semibold flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {tab === 'submissions' && (
            <div className="space-y-2">
              {employeeSubmissions.length === 0 && <p className="text-xs text-slate-500">No submissions yet.</p>}
              {employeeSubmissions.map((s) => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-800 bg-slate-950/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">{s.assignmentTitle}</h4>
                    <SubmissionStatusBadge status={s.status} />
                  </div>
                  <p className="text-[11px] text-slate-500">{s.submittedAt}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2 text-xs text-slate-400">
              <p>Last active: <span className="text-slate-200">{employee.lastActive}</span></p>
              <p>{employee.assignmentsSubmitted} assignment(s) submitted, {employee.assignmentsPending} pending.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
