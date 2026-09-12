import React from 'react';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import { useAppData } from '../../context/AppDataContext';

export const EmployeeSettingsPage: React.FC = () => {
  const { currentUser } = useAppData();
  if (!currentUser) return null;
  return <SettingsPanel currentUser={currentUser} />;
};
