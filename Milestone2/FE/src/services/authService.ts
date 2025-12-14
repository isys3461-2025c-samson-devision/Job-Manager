
import { API_BASE_URL_AUTH } from "../config";
import axios from "axios";

export const register = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/register`, { email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/login`, { email, password });
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/refresh-token`, { refreshToken });
  return response.data;
};

export const logout = async (refreshToken: string) => {
  const response = await axios.post(`${API_BASE_URL_AUTH}/logout`, { refreshToken });
  return response.data;
};

export const validateToken = async (token: string) => {
  const response = await axios.post(
    `${API_BASE_URL_AUTH}/validate-token`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL_AUTH}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteAccount = async (token: string) => {
  const response = await axios.delete(`${API_BASE_URL_AUTH}/delete-account`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};