import React from 'react';
import { SettingsPanel } from '../../components/settings/SettingsPanel';
import { useAppData } from '../../context/AppDataContext';

export const AdminSettingsPage: React.FC = () => {
  const { currentUser } = useAppData();
  if (!currentUser) return null;
  return <SettingsPanel currentUser={currentUser} />;
};
