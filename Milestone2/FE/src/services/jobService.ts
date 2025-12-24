import type { Job } from '../types';
import jobApi from './httpJob';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};

export interface GetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  employment_type?: string[];
  location?: string;
  salary_min?: number;
  salary_max?: number;
  skills?: string[];
  sortBy?: 'posted_date' | 'salary_min' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const jobService = {
  /**
   * Get all jobs with optional filters and pagination
   */
  getJobs: async (params: GetJobsParams = {}): Promise<PaginatedResponse<Job>> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.employment_type?.length) queryParams.append('employment_type', params.employment_type.join(','));
    if (params.location) queryParams.append('location', params.location);
    if (params.salary_min) queryParams.append('salary_min', params.salary_min.toString());
    if (params.salary_max) queryParams.append('salary_max', params.salary_max.toString());
    if (params.skills?.length) queryParams.append('skills', params.skills.join(','));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await jobApi.get<ApiEnvelope<PaginatedResponse<Job>>>(
      `?${queryParams.toString()}`
    );

    return response.data?.data || { items: [], total: 0, page: 1, totalPages: 1 };
  },

  /**
   * Get a single job by ID
   */
  getJobById: async (jobId: number): Promise<Job> => {
    const response = await jobApi.get<ApiEnvelope<Job>>(`/${jobId}`);

    if (!response.data?.data) {
      throw new Error('Job not found');
    }

    return response.data.data;
  },

  /**
   * Apply to a job
   */
  applyToJob: async (jobId: number, applicationData: {
    coverLetter?: string;
  }): Promise<void> => {
    await jobApi.post(`/${jobId}/apply`, applicationData);
  },
};