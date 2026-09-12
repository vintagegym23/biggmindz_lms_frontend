import { Submission } from '../types';

export interface ReviewInput {
  score: number;
  passed: boolean;
  generalNotes: string;
  timestampFeedback: { timestamp: string; comment: string }[];
}

/**
 * Pure client-side helpers over an already-fetched Submission[] (from
 * AppDataContext). Actual create/review mutations go through
 * `src/api/submissionApi.ts` against the real backend now — these two
 * functions just filter/sort data already in memory.
 */
export const submissionService = {
  getSubmissionsForUser(submissions: Submission[], userId: string): Submission[] {
    return submissions.filter((s) => s.userId === userId);
  },

  getVersionHistory(submissions: Submission[], assignmentId: string, userId: string): Submission[] {
    return submissions
      .filter((s) => s.assignmentId === assignmentId && s.userId === userId)
      .sort((a, b) => (a.version ?? 0) - (b.version ?? 0));
  }
};
