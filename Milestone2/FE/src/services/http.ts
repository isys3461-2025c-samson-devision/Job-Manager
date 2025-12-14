import axios from 'axios';
import { API_BASE_URL_AUTH } from '../config';
import { store } from '../store';
import { setToken, logout as logoutAction } from '../store/authSlice';

// Shared Axios instance for auth-related endpoints
export const api = axios.create({
  baseURL: API_BASE_URL_AUTH,
});

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

function onRefreshed(newToken: string) {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
}

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      if (isRefreshing) {
        // Queue requests until refresh finishes
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            api
              .request(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        // Backend reads refreshToken from httpOnly cookie; body can be empty
        const refreshResp = await axios.post(`${API_BASE_URL_AUTH}/refresh-token`, {});
        const newAccessToken = refreshResp?.data?.data?.accessToken;
        if (typeof newAccessToken === 'string' && newAccessToken.length > 0) {
          store.dispatch(setToken(newAccessToken));
          onRefreshed(newAccessToken);
          originalRequest.headers = originalRequest.headers || {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
          return api.request(originalRequest);
        }
        // No token -> force logout
        store.dispatch(logoutAction());
        return Promise.reject(error);
      } catch (err) {
        // Refresh failed -> logout
        store.dispatch(logoutAction());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
