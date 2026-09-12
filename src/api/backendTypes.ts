/**
 * Loose shapes for backend API responses (deliberately `any`-tolerant on
 * nested includes since Prisma's include shape varies by endpoint) — these
 * exist only to give `adapters.ts` a typed starting point. The frontend's
 * real domain types remain `src/types/index.ts`; nothing else should import
 * from this file directly.
 */

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'ADMIN' | 'TUTOR' | 'EMPLOYEE';
  department: string | null;
  title: string | null;
  joinedDate: string;
  badges: string[];
  active: boolean;
  lastActiveAt: string;
}

export interface BackendEmployeeListItem extends BackendUser {
  overallProgress: number;
  completedCoursesCount: number;
  totalAssignedCount: number;
  quizAverage: number;
  assignmentsSubmitted: number;
  assignmentsPending: number;
  status: 'on_track' | 'lagging' | 'completed';
}

export interface BackendAsset {
  id: string;
  publicId: string;
  resourceType: string;
  secureUrl: string;
  format?: string | null;
  bytes?: number | null;
}

export interface BackendLessonResource {
  id: string;
  title: string;
  kind: 'ZIP' | 'PDF' | 'LINK' | 'PRESET';
  asset: BackendAsset;
}

export interface BackendLesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  order: number;
  videoAssetId: string | null;
  videoAsset?: BackendAsset | null;
  resources?: BackendLessonResource[];
  assignment?: { id: string } | null;
  completed?: boolean;
}

export interface BackendModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: BackendLesson[];
}

export interface BackendQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface BackendQuiz {
  id: string;
  title: string;
  passingScore: number;
  questions: BackendQuizQuestion[];
}

export interface BackendCourseAssignment {
  employeeId?: string;
  employee?: { id: string; name: string; avatarUrl: string | null };
  assignedAt: string;
  dueDate: string;
}

export interface BackendCourse {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  durationHours: number;
  summary: string;
  objectives: string[];
  software: string[];
  status: 'DRAFT' | 'PUBLISHED';
  thumbnailUrl: string | null;
  instructor?: { id: string; name: string; title: string | null; avatarUrl: string | null } | null;
  quiz?: BackendQuiz | null;
  modules: BackendModule[];
  assignedTo?: BackendCourseAssignment[];
  sops?: { sop: { id: string; code: string; title: string } }[];
}

export interface BackendSopChecklistItem {
  id: string;
  stepNumber: number;
  instruction: string;
  criticalNote?: string | null;
}

export interface BackendSop {
  id: string;
  code: string;
  title: string;
  category: string;
  version: string;
  lastUpdatedAt: string;
  owner: { id: string; name: string };
  department: string;
  purpose: string;
  scope: string;
  softwareRequired: string[];
  checklist: BackendSopChecklistItem[];
  signOffs: { userId: string; signedAt: string }[];
}

export interface BackendAssignment {
  id: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  description: string;
  dueDate: string;
  rawAssetsUrl?: string | null;
  submissionFormat: string;
  rubric: { criteria: string; points: number }[];
  course?: { id: string; title: string };
}

export interface BackendSubmissionReview {
  reviewerId: string;
  reviewer: { id: string; name: string; avatarUrl: string | null };
  score: number;
  passed: boolean;
  generalNotes: string;
  reviewedAt: string;
  timestampComments: { timestamp: string; comment: string }[];
}

export interface BackendSubmission {
  id: string;
  assignmentId: string;
  userId: string;
  version: number;
  submittedAt: string;
  projectUrl: string | null;
  notes: string;
  softwareUsed: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'NEEDS_REVISION';
  assignment: { id: string; title: string; courseId: string; course: { title: string } };
  user: { id: string; name: string; avatarUrl: string | null; department: string | null };
  files: { asset: BackendAsset }[];
  review?: BackendSubmissionReview | null;
}

export interface BackendCohort {
  id: string;
  title: string;
  host: { id: string; name: string; avatarUrl: string | null };
  track: string;
  dateTime: string;
  meetLink: string;
  agenda: string[];
  attendeesCount: number;
}

export interface BackendNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  targetPath: string;
  unread: boolean;
  createdAt: string;
}

export interface BackendCertificate {
  id: string;
  userId: string;
  courseId: string;
  certificateCode: string;
  scorePercent: number | null;
  issuedAt: string;
  course: { id: string; title: string; category: string };
}
