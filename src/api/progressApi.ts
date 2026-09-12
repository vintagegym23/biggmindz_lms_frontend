import { apiClient } from './client';

export const progressApi = {
  async myCompletedCourseIds(): Promise<string[]> {
    const res = await apiClient.get('/progress/me');
    return (res.data.data as { courseId: string; percent: number }[]).filter((p) => p.percent >= 100).map((p) => p.courseId);
  }
};
