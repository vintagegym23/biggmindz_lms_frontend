import React from 'react';
import { useParams } from 'react-router-dom';
import { AssignmentView } from '../../components/employee/AssignmentView';
import { useAppData } from '../../context/AppDataContext';

export const EmployeeAssignmentsPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId?: string }>();
  const { currentUser, assignments, submissions, addSubmission } = useAppData();

  if (!currentUser) return null;

  if (assignments.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-2">
        <h2 className="text-lg font-bold text-white">No assignments yet</h2>
        <p className="text-sm text-slate-400">Your tutor hasn't published any practical assignments yet.</p>
      </div>
    );
  }

  return (
    <AssignmentView
      assignments={assignments}
      submissions={submissions}
      currentUser={currentUser}
      onNewSubmission={addSubmission}
      selectedAssignmentId={assignmentId}
    />
  );
};
