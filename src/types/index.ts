export type Role = 'employee' | 'admin' | 'tutor';

export type TrackCategory = 
  | 'video_editing'
  | 'advanced_video_editing'
  | 'digital_marketing'
  | 'social_media'
  | 'youtube_marketing'
  | 'company_sops'
  | 'creative_workflows';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  department: string;
  title: string;
  joinedDate: string;
  assignedTracks: string[];
  completedCourses: string[];
  badges: string[];
}

export interface LessonResource {
  id: string;
  title: string;
  type: 'zip' | 'pdf' | 'link' | 'preset';
  size?: string;
  url: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g. "14m 30s"
  durationMinutes: number;
  videoUrl?: string; // YouTube or sample video
  description: string;
  completed?: boolean;
  resources?: LessonResource[];
  notes?: string[];
  assignmentId?: string;
  quizId?: string;
}

/**
 * Partial lesson update, plus an already-uploaded asset id (bypasses
 * re-registering the URL). `videoAssetId: null` explicitly clears the video.
 */
export interface LessonUpdateInput extends Partial<Lesson> {
  videoAssetId?: string | null;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CourseAssignment {
  employeeId: string;
  assignedAt: string;
  dueDate: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: TrackCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  durationHours: number;
  totalLessons: number;
  thumbnail: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  summary: string;
  objectives: string[];
  modules: CourseModule[];
  prerequisites?: string[];
  software: string[];
  sopsReferenced: string[];
  quiz?: Quiz;
  status?: 'draft' | 'published';
  assignedTo?: CourseAssignment[];
}

export interface SOPItem {
  id: string;
  stepNumber: number;
  instruction: string;
  criticalNote?: string;
  completed?: boolean;
}

export interface SOPDocument {
  id: string;
  code: string; // e.g., "SOP-VID-01"
  title: string;
  category: TrackCategory;
  version: string;
  lastUpdated: string;
  owner: string;
  department: string;
  purpose: string;
  scope: string;
  checklist: SOPItem[];
  softwareRequired: string[];
  signedOffBy: string[]; // User IDs who acknowledged
}

export interface AssignmentReview {
  reviewerName: string;
  reviewerAvatar: string;
  reviewedAt: string;
  score: number; // 0 - 100
  passed: boolean;
  generalNotes: string;
  timestampFeedback?: {
    timestamp: string;
    comment: string;
  }[];
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  title: string;
  description: string;
  dueDate: string;
  rawAssetsUrl?: string;
  submissionFormat: string;
  rubric: {
    criteria: string;
    points: number;
  }[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseTitle: string;
  version?: number;
  userId: string;
  userName: string;
  userAvatar: string;
  userDepartment: string;
  submittedAt: string;
  projectUrl: string; // e.g., Frame.io, Loom, Google Drive
  videoUrl?: string; // playable preview used by the in-app Video Review Workspace
  notes: string;
  softwareUsed: string;
  status: 'pending_review' | 'approved' | 'needs_revision';
  review?: AssignmentReview;
}

export interface TraineeProgress {
  userId: string;
  userName: string;
  userAvatar: string;
  department: string;
  role: string;
  overallProgress: number; // 0 - 100
  completedCoursesCount: number;
  totalAssignedCount: number;
  lastActive: string;
  quizAverage: number;
  assignmentsSubmitted: number;
  assignmentsPending: number;
  status: 'on_track' | 'lagging' | 'completed';
  active?: boolean;
  email?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  targetPath: string;
}

export interface CohortSession {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  track: string;
  dateTime: string;
  meetLink: string;
  agenda: string[];
  attendeesCount: number;
}
