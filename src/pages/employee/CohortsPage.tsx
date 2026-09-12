import React from 'react';
import { CohortsView } from '../../components/common/CohortsView';
import { useAppData } from '../../context/AppDataContext';

export const EmployeeCohortsPage: React.FC = () => {
  const { cohorts } = useAppData();
  return <CohortsView cohorts={cohorts} />;
};
