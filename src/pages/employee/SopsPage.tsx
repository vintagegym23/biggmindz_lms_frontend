import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SOPViewer } from '../../components/employee/SOPViewer';
import { useAppData } from '../../context/AppDataContext';

export const EmployeeSopsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser, sops, signOffSOP } = useAppData();

  if (!currentUser) return null;

  return (
    <SOPViewer
      sops={sops}
      currentUser={currentUser}
      selectedSOPId={searchParams.get('sop') || undefined}
      onSignOffSOP={signOffSOP}
    />
  );
};
