import axios from 'axios';
import { API_BASE_URL_APP, API_BASE_URL_AUTH } from '../config';
import { store } from '../store';
import { setToken, logout as logoutAction } from '../store/authSlice';

export const appApi = axios.create({ baseURL: API_BASE_URL_APP });

let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];
const onRefreshed = (newToken: string) => {
  pendingRequests.forEach((cb) => cb(newToken));
  pendingRequests = [];
};

appApi.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

appApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            appApi.request(originalRequest).then(resolve).catch(reject);
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
          return appApi.request(originalRequest);
        }
        store.dispatch(logoutAction());
        return Promise.reject(error);
      } catch (err) {
        store.dispatch(logoutAction());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default appApi;
