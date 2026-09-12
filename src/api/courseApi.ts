import { apiClient } from './client';
import { adaptCourse, categoryToBackend, levelToBackend } from './adapters';
import { BackendCourse } from './backendTypes';
import { Course, TrackCategory } from '../types';

/**
 * Course Builder also lets an admin paste a plain external video/thumbnail
 * URL instead of uploading a file. The backend models media as
 * Cloudinary-backed Asset rows, so a pasted URL is registered as a
 * lightweight Asset via /uploads/confirm before being attached to the
 * lesson/course.
 */
async function registerUrlAsAsset(url: string, resourceType: 'VIDEO' | 'IMAGE'): Promise<string> {
  const res = await apiClient.post('/uploads/confirm', {
    publicId: `external/${resourceType.toLowerCase()}/${Date.now()}-${Math.random().toString(36).slice(2)}`,
    resourceType,
    secureUrl: url
  });
  return res.data.data.id as string;
}

async function withMyProgress(course: Course, courseId: string): Promise<Course> {
  try {
    const progressRes = await apiClient.get(`/progress/me/courses/${courseId}`);
    const completedIds: string[] = progressRes.data.data.completedLessonIds ?? [];
    return {
      ...course,
      modules: course.modules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => ({ ...l, completed: completedIds.includes(l.id) }))
      }))
    };
  } catch {
    return course;
  }
}

export const courseApi = {
  async list(filters?: { category?: TrackCategory; status?: 'draft' | 'published'; search?: string }): Promise<Course[]> {
    const res = await apiClient.get('/courses', {
      params: {
        category: filters?.category ? categoryToBackend(filters.category) : undefined,
        status: filters?.status ? filters.status.toUpperCase() : undefined,
        search: filters?.search || undefined
      }
    });
    return (res.data.data as BackendCourse[]).map(adaptCourse);
  },

  async getById(courseId: string, mergeMyProgress = true): Promise<Course> {
    const res = await apiClient.get(`/courses/${courseId}`);
    const course = adaptCourse(res.data.data as BackendCourse);
    return mergeMyProgress ? withMyProgress(course, courseId) : course;
  },

  async create(input: Partial<Course>): Promise<Course> {
    // durationHours is never sent — the backend always derives it from lesson durations.
    const res = await apiClient.post('/courses', {
      title: input.title,
      category: input.category ? categoryToBackend(input.category) : undefined,
      level: input.level ? levelToBackend(input.level) : undefined,
      summary: input.summary,
      software: input.software,
      thumbnailUrl: input.thumbnail || undefined
    });
    return adaptCourse(res.data.data);
  },

  async update(courseId: string, input: Partial<Course>): Promise<Course> {
    const payload: Record<string, unknown> = {
      title: input.title,
      summary: input.summary,
      software: input.software
    };
    if (input.category) payload.category = categoryToBackend(input.category);
    if (input.level) payload.level = levelToBackend(input.level);
    if (input.thumbnail) {
      payload.thumbnailUrl = input.thumbnail;
    }
    const res = await apiClient.patch(`/courses/${courseId}`, payload);
    return adaptCourse(res.data.data);
  },

  async delete(courseId: string): Promise<void> {
    await apiClient.delete(`/courses/${courseId}`);
  },

  async publish(courseId: string): Promise<Course> {
    const res = await apiClient.post(`/courses/${courseId}/publish`);
    return adaptCourse(res.data.data);
  },

  async unpublish(courseId: string): Promise<Course> {
    const res = await apiClient.post(`/courses/${courseId}/unpublish`);
    return adaptCourse(res.data.data);
  },

  async duplicate(courseId: string): Promise<Course> {
    const res = await apiClient.post(`/courses/${courseId}/duplicate`);
    return adaptCourse(res.data.data);
  },

  async assign(courseId: string, employeeIds: string[], dueDate: string): Promise<Course> {
    const res = await apiClient.post(`/courses/${courseId}/assign`, { employeeIds, dueDate });
    return adaptCourse(res.data.data);
  },

  async addModule(courseId: string, title: string): Promise<void> {
    await apiClient.post(`/courses/${courseId}/modules`, { title });
  },

  async updateModule(courseId: string, moduleId: string, updates: { title?: string; description?: string }): Promise<void> {
    await apiClient.patch(`/courses/${courseId}/modules/${moduleId}`, updates);
  },

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    await apiClient.delete(`/courses/${courseId}/modules/${moduleId}`);
  },

  async reorderLessons(courseId: string, moduleId: string, lessonIds: string[]): Promise<void> {
    await apiClient.post(`/courses/${courseId}/modules/${moduleId}/lessons/reorder`, { lessonIds });
  },

  async addLesson(courseId: string, moduleId: string, title: string): Promise<void> {
    // No video yet, so no duration yet either — it's set automatically once a video is attached.
    await apiClient.post(`/courses/${courseId}/modules/${moduleId}/lessons`, { title, durationMinutes: 0 });
  },

  async updateLesson(
    lessonId: string,
    updates: { title?: string; description?: string; durationMinutes?: number; videoUrl?: string; videoAssetId?: string | null }
  ): Promise<void> {
    const payload: Record<string, unknown> = { title: updates.title, description: updates.description };
    if (updates.durationMinutes !== undefined) {
      payload.durationMinutes = updates.durationMinutes;
    }
    if (updates.videoAssetId === null) {
      payload.videoAssetId = null; // explicit clear
    } else if (updates.videoAssetId) {
      // Already a real, uploaded Cloudinary asset (from the upload widget) — attach it directly.
      payload.videoAssetId = updates.videoAssetId;
    } else if (updates.videoUrl) {
      payload.videoAssetId = await registerUrlAsAsset(updates.videoUrl, 'VIDEO');
    }
    await apiClient.patch(`/lessons/${lessonId}`, payload);
  },

  async deleteLesson(lessonId: string): Promise<void> {
    await apiClient.delete(`/lessons/${lessonId}`);
  },

  async markLessonProgress(lessonId: string, completed: boolean): Promise<{ percent: number }> {
    const res = await apiClient.post(`/lessons/${lessonId}/progress`, { completed });
    return res.data.data;
  }
};
