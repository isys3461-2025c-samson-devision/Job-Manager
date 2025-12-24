import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL_AUTH, API_BASE_URL_JOBS } from '../config';
import { store } from '../store';
import { setToken, logout as logoutAction } from '../store/authSlice';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const jobApi = axios.create({ baseURL: API_BASE_URL_JOBS });

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
const onRefreshed = (newToken: string) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

jobApi.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

jobApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as RetriableRequestConfig;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            jobApi.request(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshResp = await axios.post(`${API_BASE_URL_AUTH}/refresh-token`, {});
        const newAccessToken = refreshResp?.data?.data?.accessToken;
        if (typeof newAccessToken === 'string' && newAccessToken.length > 0) {
          store.dispatch(setToken(newAccessToken));
          onRefreshed(newAccessToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return jobApi.request(originalRequest);
        }
        store.dispatch(logoutAction());
        return Promise.reject(error);
      } catch (refreshError) {
        store.dispatch(logoutAction());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default jobApi;