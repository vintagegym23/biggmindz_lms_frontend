import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCatalog } from '../../components/employee/CourseCatalog';
import { useAppData } from '../../context/AppDataContext';

export const EmployeeCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, courses } = useAppData();

  if (!currentUser) return null;

  return (
    <CourseCatalog
      courses={courses}
      currentUser={currentUser}
      onOpenCourse={(courseId) => navigate(`/employee/courses/${courseId}`)}
    />
  );
};
