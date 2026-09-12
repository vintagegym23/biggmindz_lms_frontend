import React from 'react';
import { useParams } from 'react-router-dom';
import { SOPViewer } from '../../components/employee/SOPViewer';
import { useAppData } from '../../context/AppDataContext';

export const AdminSopDetailPage: React.FC = () => {
  const { sopId } = useParams<{ sopId: string }>();
  const { currentUser, sops, signOffSOP } = useAppData();

  if (!currentUser) return null;

  return (
    <SOPViewer sops={sops} currentUser={currentUser} selectedSOPId={sopId} onSignOffSOP={signOffSOP} />
  );
};
