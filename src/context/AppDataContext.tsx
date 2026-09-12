import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Course, SOPDocument, Submission, TraineeProgress, CohortSession, Assignment, Notification, User } from '../types';
import { useAuth } from './AuthContext';
import { isStaffRole } from '../utils/role';
import { courseApi } from '../api/courseApi';
import { sopApi } from '../api/sopApi';
import { submissionApi } from '../api/submissionApi';
import { employeeApi } from '../api/employeeApi';
import { cohortApi } from '../api/cohortApi';
import { assignmentApi } from '../api/assignmentApi';
import { notificationApi } from '../api/notificationApi';
import { progressApi } from '../api/progressApi';
import { ReviewInput } from '../services/submissionService';

interface AppDataContextValue {
  currentUser: User | null;
  courses: Course[];
  sops: SOPDocument[];
  submissions: Submission[];
  employees: TraineeProgress[];
  cohorts: CohortSession[];
  assignments: Assignment[];
  notifications: Notification[];
  isLoading: boolean;

  refreshCourses: () => Promise<void>;
  refreshSubmissions: () => Promise<void>;
  refreshEmployees: () => Promise<void>;

  signOffSOP: (sopId: string) => Promise<void>;
  markLessonCompleted: (courseId: string, lessonId: string) => Promise<void>;
  addSubmission: (input: { assignmentId: string; projectUrl?: string; notes: string; softwareUsed: string }) => Promise<Submission>;
  submitReview: (submissionId: string, review: ReviewInput) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  duplicateCourse: (courseId: string) => Promise<Course>;
  setCourseStatus: (courseId: string, status: 'draft' | 'published') => Promise<Course>;
  assignCourseToEmployees: (courseId: string, employeeIds: string[], dueDate: string) => Promise<Course>;
  deactivateEmployee: (userId: string) => Promise<void>;
  reactivateEmployee: (userId: string) => Promise<void>;
  createEmployee: (input: { name: string; email: string; department: string; role: string; password: string }) => Promise<void>;
  resetEmployeePassword: (userId: string, password: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  markQuizPassed: (courseId: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refetchUser } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [sops, setSOPs] = useState<SOPDocument[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [employees, setEmployees] = useState<TraineeProgress[]>([]);
  const [cohorts, setCohorts] = useState<CohortSession[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser: User | null = user ? { ...user, completedCourses: completedCourseIds } : null;

  const refreshCourses = useCallback(async () => {
    if (!user) return;
    setCourses(await courseApi.list());
  }, [user]);

  const refreshSubmissions = useCallback(async () => {
    if (!user) return;
    setSubmissions(isStaffRole(user.role) ? await submissionApi.listAll() : await submissionApi.listMine());
  }, [user]);

  const refreshEmployees = useCallback(async () => {
    if (!user || !isStaffRole(user.role)) return;
    setEmployees(await employeeApi.list());
  }, [user]);

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    setNotifications(await notificationApi.list());
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      setSOPs([]);
      setSubmissions([]);
      setEmployees([]);
      setCohorts([]);
      setAssignments([]);
      setNotifications([]);
      setCompletedCourseIds([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const loaders: Promise<void>[] = [
      courseApi.list().then((data) => !cancelled && setCourses(data)),
      sopApi.list().then((data) => !cancelled && setSOPs(data)),
      cohortApi.list().then((data) => !cancelled && setCohorts(data)),
      assignmentApi.list().then((data) => !cancelled && setAssignments(data)),
      refreshNotifications(),
      refreshSubmissions(),
      refreshEmployees()
    ];

    if (user.role === 'employee') {
      loaders.push(progressApi.myCompletedCourseIds().then((ids) => !cancelled && setCompletedCourseIds(ids)));
    }

    Promise.all(loaders).finally(() => !cancelled && setIsLoading(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const signOffSOP = useCallback(async (sopId: string) => {
    const updated = await sopApi.signOff(sopId);
    setSOPs((prev) => prev.map((s) => (s.id === sopId ? updated : s)));
  }, []);

  const markLessonCompleted = useCallback(async (courseId: string, lessonId: string) => {
    await courseApi.markLessonProgress(lessonId, true);
    setCourses((prev) =>
      prev.map((c) =>
        c.id !== courseId
          ? c
          : { ...c, modules: c.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)) })) }
      )
    );
    const ids = await progressApi.myCompletedCourseIds();
    setCompletedCourseIds(ids);
  }, []);

  const addSubmission = useCallback(async (input: { assignmentId: string; projectUrl?: string; notes: string; softwareUsed: string }) => {
    const created = await submissionApi.create(input.assignmentId, input);
    setSubmissions((prev) => [created, ...prev]);
    return created;
  }, []);

  const submitReview = useCallback(async (submissionId: string, review: ReviewInput) => {
    const updated = await submissionApi.review(submissionId, review);
    setSubmissions((prev) => prev.map((s) => (s.id === submissionId ? updated : s)));
  }, []);

  const deleteCourse = useCallback(async (courseId: string) => {
    await courseApi.delete(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  }, []);

  const duplicateCourse = useCallback(async (courseId: string) => {
    const copy = await courseApi.duplicate(courseId);
    setCourses((prev) => [copy, ...prev]);
    return copy;
  }, []);

  const setCourseStatus = useCallback(async (courseId: string, status: 'draft' | 'published') => {
    const updated = status === 'published' ? await courseApi.publish(courseId) : await courseApi.unpublish(courseId);
    setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    return updated;
  }, []);

  const assignCourseToEmployees = useCallback(async (courseId: string, employeeIds: string[], dueDate: string) => {
    const updated = await courseApi.assign(courseId, employeeIds, dueDate);
    setCourses((prev) => prev.map((c) => (c.id === courseId ? updated : c)));
    return updated;
  }, []);

  const deactivateEmployee = useCallback(async (userId: string) => {
    const updated = await employeeApi.deactivate(userId);
    setEmployees((prev) => prev.map((e) => (e.userId === userId ? updated : e)));
  }, []);

  const reactivateEmployee = useCallback(async (userId: string) => {
    const updated = await employeeApi.reactivate(userId);
    setEmployees((prev) => prev.map((e) => (e.userId === userId ? updated : e)));
  }, []);

  const createEmployee = useCallback(async (input: { name: string; email: string; department: string; role: string; password: string }) => {
    const created = await employeeApi.create(input);
    setEmployees((prev) => [created, ...prev]);
  }, []);

  const resetEmployeePassword = useCallback(async (userId: string, password: string) => {
    await employeeApi.resetPassword(userId, password);
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    await notificationApi.markRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await notificationApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markQuizPassed = useCallback((courseId: string) => {
    setCompletedCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
    refetchUser();
  }, [refetchUser]);

  return (
    <AppDataContext.Provider
      value={{
        currentUser,
        courses,
        sops,
        submissions,
        employees,
        cohorts,
        assignments,
        notifications,
        isLoading,
        refreshCourses,
        refreshSubmissions,
        refreshEmployees,
        signOffSOP,
        markLessonCompleted,
        addSubmission,
        submitReview,
        deleteCourse,
        duplicateCourse,
        setCourseStatus,
        assignCourseToEmployees,
        deactivateEmployee,
        reactivateEmployee,
        createEmployee,
        resetEmployeePassword,
        markNotificationRead,
        markAllNotificationsRead,
        markQuizPassed
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within an AppDataProvider');
  return ctx;
}
