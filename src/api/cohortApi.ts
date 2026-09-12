import { apiClient } from './client';
import { adaptCohort } from './adapters';
import { BackendCohort } from './backendTypes';
import { CohortSession } from '../types';

export const cohortApi = {
  async list(): Promise<CohortSession[]> {
    const res = await apiClient.get('/cohorts');
    return (res.data.data as BackendCohort[]).map(adaptCohort);
  }
};
