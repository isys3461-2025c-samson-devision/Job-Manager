import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Job, JobFilters, JobState } from '../types';

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  filters: {},
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },

    setCurrentJob: (state, action: PayloadAction<Job | null>) => {
      state.currentJob = action.payload;
    },

    setFilters: (state, action: PayloadAction<JobFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },

    updateFilters: (state, action: PayloadAction<Partial<JobFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },

    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    setJobLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setJobError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setPagination: (state, action: PayloadAction<{ totalPages: number; currentPage: number }>) => {
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    resetJobState: () => initialState,
  },
});

export const {
  setJobs,
  setCurrentJob,
  setFilters,
  updateFilters,
  clearFilters,
  setJobLoading,
  setJobError,
  setPagination,
  setCurrentPage,
  resetJobState,
} = jobSlice.actions;

export default jobSlice.reducer;