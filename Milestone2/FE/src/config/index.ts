// src/config/index.ts

// Đặt URL API backend tại đây
export const API_BASE_URL_AUTH = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/auth';
export const API_BASE_URL_APP = import.meta.env.VITE_API_BASE_URL_APP || 'http://localhost:3001/api';
export const API_BASE_URL_USER_PROFILE = import.meta.env.VITE_API_BASE_URL_USERS_PROFILE || 'http://localhost:3002/api/profile';
export const API_BASE_URL_JOBS = import.meta.env.VITE_API_BASE_URL_JOBS || 'http://localhost:3003/api/jobs';
