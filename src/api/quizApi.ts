import { apiClient } from './client';

export interface QuizAttemptResult {
  attemptId: string;
  score: number;
  passed: boolean;
  passingScore: number;
  questions: { question: string; options: string[]; correctIndex: number; explanation: string; userAnswer: number; isCorrect: boolean }[];
}

export const quizApi = {
  async submitAttempt(quizId: string, answers: Record<number, number>): Promise<QuizAttemptResult> {
    const res = await apiClient.post(`/quizzes/${quizId}/attempts`, { answers });
    return res.data.data;
  }
};
