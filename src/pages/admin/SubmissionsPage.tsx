import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReviewsDesk } from '../../components/admin/ReviewsDesk';
import { useAppData } from '../../context/AppDataContext';

export const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, submissions } = useAppData();

  if (!currentUser) return null;

  return (
    <ReviewsDesk
      submissions={submissions}
      currentAdmin={currentUser}
      onOpenReviewModal={(sub) => navigate(`/admin/submissions/${sub.id}`)}
    />
  );
};
