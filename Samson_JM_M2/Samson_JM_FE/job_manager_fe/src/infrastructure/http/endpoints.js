export const API = {
  AUTH: {
    LOGIN: "/auth/company/login",
    REGISTER: "/auth/company/signup",
  },
  COMPANY: {
    PROFILE: "/company/profile",
    UPDATE_PROFILE: "/company/profile/update",
  },
  JOBPOST: {
    ALL: "/company/jobs",
    CREATE: "/company/jobs/create",
    BY_ID: (id) => `/company/jobs/${id}`,
    APPLICANTS: (id) => `/company/jobs/${id}/applicants`,
  },
};
