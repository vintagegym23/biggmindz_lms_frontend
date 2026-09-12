import React, { useMemo, useState } from 'react';
import { Users, Search, MoreVertical, UserPlus } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { useToast } from '../../context/ToastContext';
import { EmployeeDrawer } from '../../components/employees/EmployeeDrawer';
import { AddEmployeeDialog } from '../../components/employees/AddEmployeeDialog';
import { ResetPasswordDialog } from '../../components/employees/ResetPasswordDialog';
import { SelectCourseDialog } from '../../components/courses/SelectCourseDialog';
import { CourseAssignmentDialog } from '../../components/courses/CourseAssignmentDialog';
import { extractErrorMessage } from '../../api/client';
import { Course, TraineeProgress } from '../../types';

export const EmployeesPage: React.FC = () => {
  const { employees, courses, sops, submissions, deactivateEmployee, reactivateEmployee, createEmployee, resetEmployeePassword, assignCourseToEmployees } = useAppData();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [status, setStatus] = useState('all');
  const [progressFilter, setProgressFilter] = useState('all');

  const [drawerEmployee, setDrawerEmployee] = useState<TraineeProgress | null>(null);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'progress'>('profile');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [assignFlowEmployee, setAssignFlowEmployee] = useState<TraineeProgress | null>(null);
  const [assignFlowCourse, setAssignFlowCourse] = useState<Course | null>(null);
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState<TraineeProgress | null>(null);

  const departments = useMemo(() => ['all', ...Array.from(new Set(employees.map((e) => e.department)))], [employees]);

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.userName.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'all' || e.department === department;
    const matchStatus =
      status === 'all' ||
      (status === 'inactive' ? e.active === false : e.status === status && e.active !== false);
    const matchProgress =
      progressFilter === 'all' ||
      (progressFilter === 'low' && e.overallProgress < 50) ||
      (progressFilter === 'mid' && e.overallProgress >= 50 && e.overallProgress < 90) ||
      (progressFilter === 'high' && e.overallProgress >= 90);
    return matchSearch && matchDept && matchStatus && matchProgress;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="h-4 w-4" />
            <span>Employee Directory</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">Employees</h1>
          <p className="text-sm text-slate-400 mt-1">Manage BiggMinds trainees, assign curricula, and track progress.</p>
        </div>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md shadow-amber-500/20"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="on_track">On Track</option>
          <option value="lagging">Lagging</option>
          <option value="completed">Completed</option>
          <option value="inactive">Deactivated</option>
        </select>
        <select
          value={progressFilter}
          onChange={(e) => setProgressFilter(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        >
          <option value="all">All Progress</option>
          <option value="low">Below 50%</option>
          <option value="mid">50% – 89%</option>
          <option value="high">90%+</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3.5 pl-4">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Assigned Courses</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((emp) => (
                <tr key={emp.userId} className={`hover:bg-slate-800/40 transition-colors ${emp.active === false ? 'opacity-50' : ''}`}>
                  <td className="p-3.5 pl-4">
                    <div className="flex items-center gap-2.5">
                      <img src={emp.userAvatar} alt={emp.userName} className="h-8 w-8 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="font-bold text-white leading-tight">{emp.userName}</div>
                        <div className="text-[10px] text-slate-500">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-300">{emp.department}</td>
                  <td className="p-3.5 text-slate-300 font-mono">{emp.totalAssignedCount}</td>
                  <td className="p-3.5">
                    <div className="space-y-1 w-24">
                      <span className="text-[10px] font-mono text-slate-400">{emp.overallProgress}%</span>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${emp.overallProgress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    {emp.active === false ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Deactivated</span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        emp.status === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : emp.status === 'on_track'
                          ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {emp.status.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400">{emp.lastActive}</td>
                  <td className="p-3.5 pr-4 text-right relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === emp.userId ? null : emp.userId)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === emp.userId && (
                      <div className="absolute right-4 mt-1 w-44 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl z-20 p-1.5 text-left">
                        <button
                          onClick={() => { setDrawerEmployee(emp); setDrawerTab('profile'); setOpenMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => { setDrawerEmployee(emp); setDrawerTab('progress'); setOpenMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          View Progress
                        </button>
                        <button
                          onClick={() => { setAssignFlowEmployee(emp); setOpenMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          Assign Course
                        </button>
                        <button
                          onClick={() => { setResetPasswordEmployee(emp); setOpenMenuId(null); }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          Reset Password
                        </button>
                        {emp.active === false ? (
                          <button
                            onClick={async () => {
                              setOpenMenuId(null);
                              try {
                                await reactivateEmployee(emp.userId);
                                showToast(`${emp.userName} reactivated.`);
                              } catch (err) {
                                showToast(extractErrorMessage(err), 'error');
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              setOpenMenuId(null);
                              try {
                                await deactivateEmployee(emp.userId);
                                showToast(`${emp.userName} deactivated.`, 'info');
                              } catch (err) {
                                showToast(extractErrorMessage(err), 'error');
                              }
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 space-y-1">
            <p className="text-sm font-bold text-white">No employees found.</p>
            <p className="text-xs">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {drawerEmployee && (
        <EmployeeDrawer
          employee={drawerEmployee}
          courses={courses}
          sops={sops}
          submissions={submissions}
          initialTab={drawerTab}
          onClose={() => setDrawerEmployee(null)}
        />
      )}

      {showAddEmployee && (
        <AddEmployeeDialog
          onClose={() => setShowAddEmployee(false)}
          onCreate={async (input) => {
            try {
              await createEmployee(input);
              showToast(`${input.name} added successfully.`);
            } catch (err) {
              showToast(extractErrorMessage(err), 'error');
            }
          }}
        />
      )}

      {assignFlowEmployee && !assignFlowCourse && (
        <SelectCourseDialog
          courses={courses}
          onClose={() => setAssignFlowEmployee(null)}
          onSelect={(course) => setAssignFlowCourse(course)}
        />
      )}

      {assignFlowEmployee && assignFlowCourse && (
        <CourseAssignmentDialog
          courseTitle={assignFlowCourse.title}
          employees={employees}
          preselectedEmployeeIds={[assignFlowEmployee.userId]}
          onClose={() => {
            setAssignFlowEmployee(null);
            setAssignFlowCourse(null);
          }}
          onAssign={async (employeeIds, dueDate) => {
            try {
              await assignCourseToEmployees(assignFlowCourse.id, employeeIds, dueDate);
              showToast('Course assigned successfully.');
            } catch (err) {
              showToast(extractErrorMessage(err), 'error');
            }
          }}
        />
      )}

      {resetPasswordEmployee && (
        <ResetPasswordDialog
          employeeName={resetPasswordEmployee.userName}
          onClose={() => setResetPasswordEmployee(null)}
          onSubmit={async (password) => {
            await resetEmployeePassword(resetPasswordEmployee.userId, password);
            showToast(`Password reset for ${resetPasswordEmployee.userName}.`);
          }}
        />
      )}
    </div>
  );
};
