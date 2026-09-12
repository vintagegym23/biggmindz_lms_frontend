import { apiClient } from './client';
import { adaptSubmission } from './adapters';
import { BackendSubmission } from './backendTypes';
import { Submission } from '../types';

export const submissionApi = {
  async listMine(): Promise<Submission[]> {
    const res = await apiClient.get('/submissions/mine');
    return (res.data.data as BackendSubmission[]).map(adaptSubmission);
  },

  async listAll(filters?: { status?: Submission['status'] }): Promise<Submission[]> {
    const statusMap: Record<Submission['status'], string> = { pending_review: 'PENDING_REVIEW', approved: 'APPROVED', needs_revision: 'NEEDS_REVISION' };
    const res = await apiClient.get('/submissions', { params: { status: filters?.status ? statusMap[filters.status] : undefined } });
    return (res.data.data as BackendSubmission[]).map(adaptSubmission);
  },

  async getById(submissionId: string): Promise<Submission> {
    const res = await apiClient.get(`/submissions/${submissionId}`);
    return adaptSubmission(res.data.data as BackendSubmission);
  },

  async create(assignmentId: string, input: { projectUrl?: string; notes: string; softwareUsed: string }): Promise<Submission> {
    const res = await apiClient.post(`/assignments/${assignmentId}/submissions`, input);
    return adaptSubmission(res.data.data as BackendSubmission);
  },

  async review(
    submissionId: string,
    input: { score: number; passed: boolean; generalNotes: string; timestampFeedback: { timestamp: string; comment: string }[] }
  ): Promise<Submission> {
    const res = await apiClient.post(`/submissions/${submissionId}/review`, input);
    return adaptSubmission(res.data.data as BackendSubmission);
  }
};
