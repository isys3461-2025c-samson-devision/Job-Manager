import { localStorageUtil } from "../storage/localStorageUtil";


const BASE_URL = "http://localhost:8080"; // Change for deployment

async function request(method, path, body, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // ✅ DO NOT attach token to auth endpoints
  if (!path.startsWith("/api/auth")) {
    const token = localStorageUtil.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return response.json();
}


export const httpClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};