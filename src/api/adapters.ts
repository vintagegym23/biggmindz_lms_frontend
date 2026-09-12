import {
  User,
  Course,
  CourseModule,
  Lesson,
  LessonResource,
  SOPDocument,
  Assignment,
  Submission,
  TraineeProgress,
  CohortSession,
  Notification,
  Role,
  TrackCategory,
  Course as FrontendCourse
} from '../types';
import {
  BackendUser,
  BackendEmployeeListItem,
  BackendCourse,
  BackendModule,
  BackendLesson,
  BackendLessonResource,
  BackendSop,
  BackendAssignment,
  BackendSubmission,
  BackendCohort,
  BackendNotification
} from './backendTypes';
import { formatDisplayDate, formatDisplayDateTime, formatDurationMinutes, formatMonthYear, formatRelativeTime, formatBytes } from './format';

/** Placeholder avatar for any user without a real one on file, instead of a broken empty `src`. */
function placeholderAvatar(seed: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;
}

const ROLE_MAP: Record<BackendUser['role'], Role> = { ADMIN: 'admin', TUTOR: 'tutor', EMPLOYEE: 'employee' };
const LEVEL_MAP: Record<string, FrontendCourse['level']> = { BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced', MASTERY: 'Mastery' };
const RESOURCE_KIND_MAP: Record<string, LessonResource['type']> = { ZIP: 'zip', PDF: 'pdf', LINK: 'link', PRESET: 'preset' };

export function categoryToFrontend(category: string): TrackCategory {
  return category.toLowerCase() as TrackCategory;
}
export function categoryToBackend(category: TrackCategory): string {
  return category.toUpperCase();
}
export function levelToBackend(level: FrontendCourse['level']): string {
  return level.toUpperCase();
}
export function statusToFrontend(status: 'DRAFT' | 'PUBLISHED'): 'draft' | 'published' {
  return status === 'PUBLISHED' ? 'published' : 'draft';
}
export function submissionStatusToFrontend(status: BackendSubmission['status']): Submission['status'] {
  return status === 'PENDING_REVIEW' ? 'pending_review' : status === 'APPROVED' ? 'approved' : 'needs_revision';
}

export function adaptUser(u: BackendUser, extra?: { assignedTracks?: string[]; completedCourses?: string[] }): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatarUrl ?? placeholderAvatar(u.name),
    role: ROLE_MAP[u.role],
    department: u.department ?? '',
    title: u.title ?? '',
    joinedDate: formatMonthYear(u.joinedDate),
    assignedTracks: extra?.assignedTracks ?? [],
    completedCourses: extra?.completedCourses ?? [],
    badges: u.badges ?? []
  };
}

export function adaptEmployee(e: BackendEmployeeListItem): TraineeProgress {
  return {
    userId: e.id,
    userName: e.name,
    userAvatar: e.avatarUrl ?? placeholderAvatar(e.name),
    department: e.department ?? '',
    role: e.title ?? '',
    overallProgress: e.overallProgress,
    completedCoursesCount: e.completedCoursesCount,
    totalAssignedCount: e.totalAssignedCount,
    lastActive: formatRelativeTime(e.lastActiveAt),
    quizAverage: e.quizAverage,
    assignmentsSubmitted: e.assignmentsSubmitted,
    assignmentsPending: e.assignmentsPending,
    status: e.status,
    active: e.active,
    email: e.email
  };
}

function adaptLessonResource(r: BackendLessonResource): LessonResource {
  return {
    id: r.id,
    title: r.title,
    type: RESOURCE_KIND_MAP[r.kind],
    size: formatBytes(r.asset.bytes),
    url: r.asset.secureUrl
  };
}

function adaptLesson(l: BackendLesson): Lesson {
  return {
    id: l.id,
    title: l.title,
    duration: formatDurationMinutes(l.durationMinutes),
    durationMinutes: l.durationMinutes,
    videoUrl: l.videoAsset?.secureUrl,
    description: l.description,
    completed: l.completed ?? false,
    resources: l.resources?.map(adaptLessonResource),
    assignmentId: l.assignment?.id,
    quizId: undefined
  };
}

function adaptModule(m: BackendModule): CourseModule {
  return {
    id: m.id,
    title: m.title,
    description: m.description,
    lessons: [...m.lessons].sort((a, b) => a.order - b.order).map(adaptLesson)
  };
}

export function adaptCourse(c: BackendCourse): Course {
  const modules = [...c.modules].sort((a, b) => a.order - b.order).map(adaptModule);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    category: categoryToFrontend(c.category),
    level: LEVEL_MAP[c.level] ?? 'Beginner',
    durationHours: c.durationHours,
    totalLessons,
    thumbnail: c.thumbnailUrl || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    instructor: {
      name: c.instructor?.name ?? 'BiggMinds Academy',
      role: c.instructor?.title ?? 'Instructor',
      avatar: c.instructor?.avatarUrl ?? placeholderAvatar(c.instructor?.name ?? 'Instructor')
    },
    summary: c.summary,
    objectives: c.objectives,
    modules,
    software: c.software,
    sopsReferenced: c.sops?.map((s) => s.sop.code) ?? [],
    quiz: c.quiz
      ? {
          id: c.quiz.id,
          title: c.quiz.title,
          passingScore: c.quiz.passingScore,
          questions: c.quiz.questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex ?? -1,
            explanation: q.explanation ?? ''
          }))
        }
      : undefined,
    status: statusToFrontend(c.status),
    assignedTo: c.assignedTo?.map((a) => ({
      employeeId: a.employee?.id ?? a.employeeId ?? '',
      assignedAt: formatRelativeTime(a.assignedAt),
      dueDate: formatDisplayDate(a.dueDate)
    }))
  };
}

export function adaptSop(s: BackendSop): SOPDocument {
  return {
    id: s.id,
    code: s.code,
    title: s.title,
    category: categoryToFrontend(s.category),
    version: s.version,
    lastUpdated: formatDisplayDate(s.lastUpdatedAt),
    owner: s.owner.name,
    department: s.department,
    purpose: s.purpose,
    scope: s.scope,
    checklist: s.checklist.map((c) => ({
      id: c.id,
      stepNumber: c.stepNumber,
      instruction: c.instruction,
      criticalNote: c.criticalNote ?? undefined
    })),
    softwareRequired: s.softwareRequired,
    signedOffBy: s.signOffs.map((so) => so.userId)
  };
}

export function adaptAssignment(a: BackendAssignment): Assignment {
  return {
    id: a.id,
    courseId: a.courseId,
    courseTitle: a.course?.title ?? '',
    lessonId: a.lessonId ?? '',
    title: a.title,
    description: a.description,
    dueDate: formatDisplayDate(a.dueDate),
    rawAssetsUrl: a.rawAssetsUrl ?? undefined,
    submissionFormat: a.submissionFormat,
    rubric: a.rubric
  };
}

export function adaptSubmission(s: BackendSubmission): Submission {
  return {
    id: s.id,
    assignmentId: s.assignmentId,
    assignmentTitle: s.assignment.title,
    courseTitle: s.assignment.course.title,
    version: s.version,
    userId: s.userId,
    userName: s.user.name,
    userAvatar: s.user.avatarUrl ?? placeholderAvatar(s.user.name),
    userDepartment: s.user.department ?? '',
    submittedAt: formatDisplayDateTime(s.submittedAt),
    projectUrl: s.projectUrl ?? '',
    videoUrl: s.files[0]?.asset.secureUrl,
    notes: s.notes,
    softwareUsed: s.softwareUsed,
    status: submissionStatusToFrontend(s.status),
    review: s.review
      ? {
          reviewerName: s.review.reviewer.name,
          reviewerAvatar: s.review.reviewer.avatarUrl ?? placeholderAvatar(s.review.reviewer.name),
          reviewedAt: formatRelativeTime(s.review.reviewedAt),
          score: s.review.score,
          passed: s.review.passed,
          generalNotes: s.review.generalNotes,
          timestampFeedback: s.review.timestampComments.map((t) => ({ timestamp: t.timestamp, comment: t.comment }))
        }
      : undefined
  };
}

export function adaptCohort(c: BackendCohort): CohortSession {
  return {
    id: c.id,
    title: c.title,
    hostName: c.host.name,
    hostAvatar: c.host.avatarUrl ?? placeholderAvatar(c.host.name),
    track: c.track,
    dateTime: formatDisplayDateTime(c.dateTime),
    meetLink: c.meetLink,
    agenda: c.agenda,
    attendeesCount: c.attendeesCount
  };
}

export function adaptNotification(n: BackendNotification): Notification {
  return {
    id: n.id,
    userId: n.userId,
    title: n.title,
    message: n.message,
    time: formatRelativeTime(n.createdAt),
    unread: n.unread,
    targetPath: n.targetPath
  };
}
