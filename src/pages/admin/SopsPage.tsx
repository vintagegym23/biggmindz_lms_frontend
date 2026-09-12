import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SOPManager } from '../../components/admin/SOPManager';
import { useAppData } from '../../context/AppDataContext';

export const AdminSopsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sops, employees } = useAppData();

  return (
    <SOPManager
      sops={sops}
      trainees={employees}
      onOpenSOP={(id) => navigate(`/admin/sops/${id}`)}
    />
  );
};
