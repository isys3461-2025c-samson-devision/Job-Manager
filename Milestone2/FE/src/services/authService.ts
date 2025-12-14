
import { API_BASE_URL_AUTH } from "../config";
import api from "./http";

export const register = async (email: string, password: string) => {
  const response = await api.post(`/register`, { email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post(`/login`, { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken?: string) => {
  // backend will read refreshToken from cookie if not provided in body
  const response = await api.post(`/refresh-token`, refreshToken ? { refreshToken } : {});
  return response.data;
};

export const logout = async (refreshToken?: string) => {
  const response = await api.post(`/logout`, refreshToken ? { refreshToken } : {});
  return response.data;
};

export const validateToken = async (token: string) => {
  const response = await api.post(
    `/validate-token`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get(`/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteAccount = async (token: string) => {
  const response = await api.delete(`/delete-account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};