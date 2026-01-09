import { localStorageUtil } from "../storage/localStorageUtil";

const BASE_URL = "http://localhost:8080"; // Change for deployment

export class HttpError extends Error {
  constructor(status, message, data, url) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.url = url;
  }
}

async function parseResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";

  // 204 No Content
  if (response.status === 204) return null;

  // Try JSON first
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  // Fallback: text
  try {
    return await response.text();
  } catch {
    return null;
  }
}

async function request(method, path, body, options = {}) {
  const url = `${BASE_URL}${path}`;

  const headers = {
    ...(options.headers || {}),
  };

  // Only set JSON content-type when we actually send a JSON body
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (body != null && !isFormData && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  // ✅ DO NOT attach token to auth endpoints
  if (!path.startsWith("/api/auth")) {
    const token = localStorageUtil.getToken?.() || localStorageUtil.getToken?.call(localStorageUtil);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    method,
    headers,
    // Pass through common fetch options if provided
    signal: options.signal,
    credentials: options.credentials, // e.g. "include" if you ever use cookies
    mode: options.mode,
    cache: options.cache,
    redirect: options.redirect,
  };

  // Attach body only when it exists + method allows it
  if (body != null && method !== "GET" && method !== "HEAD") {
    fetchOptions.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  const data = await parseResponseBody(response);

  if (!response.ok) {
    // Make 401 easy to handle in UI (no more "Failed to fetch" confusion)
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      response.statusText ||
      `HTTP ${response.status}`;

    throw new HttpError(response.status, message, data, url);
  }

  return data;
}

export const httpClient = {
  get: (path, options) => request("GET", path, undefined, options),
  post: (path, body, options) => request("POST", path, body, options),
  put: (path, body, options) => request("PUT", path, body, options),
  patch: (path, body, options) => request("PATCH", path, body, options),
  delete: (path, options) => request("DELETE", path, undefined, options),
};
