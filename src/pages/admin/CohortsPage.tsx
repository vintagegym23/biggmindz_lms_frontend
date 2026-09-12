import React from 'react';
import { CohortsView } from '../../components/common/CohortsView';
import { useAppData } from '../../context/AppDataContext';

export const AdminCohortsPage: React.FC = () => {
  const { cohorts } = useAppData();
  return <CohortsView cohorts={cohorts} />;
};
