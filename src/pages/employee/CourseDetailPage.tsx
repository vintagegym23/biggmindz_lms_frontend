import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CoursePlayer } from '../../components/employee/CoursePlayer';
import { QuizModal } from '../../components/employee/QuizModal';
import { CertificateModal } from '../../components/employee/CertificateModal';
import { PageLoadingFallback } from '../../components/common/PageLoadingFallback';
import { useAppData } from '../../context/AppDataContext';
import { courseApi } from '../../api/courseApi';
import { Course } from '../../types';

export const EmployeeCourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const { currentUser, sops, markLessonCompleted, markQuizPassed } = useAppData();

  // The shared course list (used by the catalog grid) only carries lesson
  // ids for a lightweight payload — the player needs full lesson content,
  // so this page fetches the single course detail directly.
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quizCourse, setQuizCourse] = useState<Course | null>(null);
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    courseApi
      .getById(courseId)
      .then((c) => !cancelled && setCourse(c))
      .catch(() => !cancelled && setNotFound(true))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  if (!currentUser) return null;

  if (isLoading) return <PageLoadingFallback />;

  if (notFound || !course) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-3">
        <h2 className="text-lg font-bold text-white">Course not found</h2>
        <p className="text-sm text-slate-400">This training track doesn't exist or was archived.</p>
        <button
          onClick={() => navigate('/employee/courses')}
          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold"
        >
          Back to Course Catalog
        </button>
      </div>
    );
  }

  const handleMarkLessonCompleted = async (cId: string, lId: string) => {
    await markLessonCompleted(cId, lId);
    setCourse((prev) =>
      prev ? { ...prev, modules: prev.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === lId ? { ...l, completed: true } : l)) })) } : prev
    );
  };

  return (
    <>
      <CoursePlayer
        key={course.id}
        course={course}
        initialLessonId={lessonId}
        sops={sops}
        onOpenSOP={(sopId) => navigate(`/employee/sops?sop=${sopId}`)}
        onOpenQuiz={(c) => setQuizCourse(c)}
        onOpenAssignment={(assignmentId) => navigate(`/employee/assignments/${assignmentId}`)}
        onBack={() => navigate('/employee/courses')}
        onMarkLessonCompleted={handleMarkLessonCompleted}
        onLessonChange={(newLessonId) => navigate(`/employee/courses/${course.id}/lessons/${newLessonId}`, { replace: true })}
      />

      {quizCourse && (
        <QuizModal
          course={quizCourse}
          onClose={() => setQuizCourse(null)}
          onPassed={markQuizPassed}
          onViewCertificate={(c) => {
            setQuizCourse(null);
            setCertificateCourse(c);
          }}
        />
      )}

      {certificateCourse && currentUser && (
        <CertificateModal
          course={certificateCourse}
          currentUser={currentUser}
          onClose={() => setCertificateCourse(null)}
        />
      )}
    </>
  );
};
