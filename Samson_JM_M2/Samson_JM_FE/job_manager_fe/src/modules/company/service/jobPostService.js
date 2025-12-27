import { AUTH_ENDPOINTS } from "../../../infrastructure/http/endpoints";
import { httpClient } from "../../../infrastructure/http/httpClient";

export const jobPostService = {
  getCompanyJobPosts() {
    return httpClient.get(AUTH_ENDPOINTS.JOBPOST.ALL);
  },

  createJobPost(payload) {
    return httpClient.post(AUTH_ENDPOINTS.JOBPOST.CREATE, payload);
  },

  updateJobPost(id, payload) {
    return httpClient.put(AUTH_ENDPOINTS.JOBPOST.BY_ID(id), payload);
  },

  publishJobPost(id, publish) {
    return httpClient.patch(
      `${AUTH_ENDPOINTS.JOBPOST.PUBLISH(id)}?publish=${publish}`
    );
  },

  deleteJobPost(id) {
    return httpClient.delete(AUTH_ENDPOINTS.JOBPOST.BY_ID(id));
  },
};
