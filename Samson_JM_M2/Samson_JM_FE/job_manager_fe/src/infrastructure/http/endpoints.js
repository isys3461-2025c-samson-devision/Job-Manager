export const AUTH_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  COMPANY: {
    PROFILE: "/api/company/profile",
    UPDATE_PROFILE: "/api/company/profile/update",
  },
  JOBPOST: {
    ALL: "/api/company/jobs",
    CREATE: "/api/company/jobs/create",
    BY_ID: (id) => `/api/company/jobs/${id}`,
    APPLICANTS: (id) => `/company/jobs/${id}/applicants`,
  },
};
