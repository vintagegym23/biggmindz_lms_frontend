import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmployeeDashboard } from '../../components/employee/EmployeeDashboard';
import { useAppData } from '../../context/AppDataContext';
import { courseApi } from '../../api/courseApi';
import { Course } from '../../types';

const VIEW_TO_PATH: Record<string, string> = {
  dashboard: '/employee/dashboard',
  courses: '/employee/courses',
  sops: '/employee/sops',
  assignments: '/employee/assignments',
  certificates: '/employee/certificates',
  cohorts: '/employee/cohorts',
  submissions: '/employee/submissions'
};

export const EmployeeDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, courses, sops, submissions, cohorts } = useAppData();

  // EmployeeDashboard's "Resume Learning" spotlight reads a specific
  // lesson's title/duration — the shared course list only carries lesson
  // ids (a lightweight payload for the catalog grid), so the one course
  // being spotlighted is swapped for its full detail here.
  const [spotlightCourse, setSpotlightCourse] = useState<Course | null>(null);
  const spotlightId = courses[0]?.id;

  useEffect(() => {
    if (!spotlightId) return;
    let cancelled = false;
    courseApi.getById(spotlightId).then((full) => !cancelled && setSpotlightCourse(full));
    return () => {
      cancelled = true;
    };
  }, [spotlightId]);

  if (!currentUser) return null;

  const coursesForDisplay =
    spotlightCourse && courses.length > 0 ? [spotlightCourse, ...courses.slice(1)] : courses;

  return (
    <EmployeeDashboard
      currentUser={currentUser}
      courses={coursesForDisplay}
      sops={sops}
      submissions={submissions}
      cohorts={cohorts}
      onOpenCourse={(courseId, lessonId) =>
        navigate(lessonId ? `/employee/courses/${courseId}/lessons/${lessonId}` : `/employee/courses/${courseId}`)
      }
      onOpenSOP={(sopId) => navigate(`/employee/sops?sop=${sopId}`)}
      onNavigateTo={(view) => navigate(VIEW_TO_PATH[view] || '/employee/dashboard')}
    />
  );
};
