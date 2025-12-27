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
    ALL: "/api/company/jobposts",
    CREATE: "/api/company/jobposts/",
    BY_ID: (id) => `/api/company/jobposts/${id}`,
    PUBLISH: (id) => `/api/company/jobposts/${id}/publish`,
  },
};
