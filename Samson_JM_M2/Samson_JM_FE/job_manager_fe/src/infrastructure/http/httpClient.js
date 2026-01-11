import { localStorageUtil } from "../storage/localStorageUtil";

const BASE_URL = "http://localhost:8080"; // Change for deployment

async function request(method, path, body, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // ✅ DO NOT attach token to auth or oauth endpoints
  if (!path.startsWith("/api/auth") && !path.startsWith("/oauth2")) {
    const token = localStorageUtil.getToken();

    // ✅ Only attach REAL JWTs
    if (token && token.split(".").length === 3) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  // ✅ Check if response actually has JSON
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    return null; // 👈 THIS is the missing piece
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

export const hasValidToken = () => {
  const token = localStorage.getItem("accessToken");
  return token && token.split(".").length === 3;
};
