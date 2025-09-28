// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearAuth } from "./auth";

// e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:5077/api
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

// ---- Axios instances ----
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // keep as you had it
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Attach timezone header + Bearer token (browser only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) config.headers["X-Timezone"] = tz;

    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auto-refresh on 401 (single-flight) ----
let refreshing = false;
let queue: Array<() => void> = [];

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // IMPORTANT: call absolute path to avoid interceptor loops if needed
  const url = `${API_BASE}/auth/refresh`;
  const { data } = await axios.post(url, { refreshToken }, { withCredentials: true });
  // Accept both camelCase and snake_case just in case
  const access = data.accessToken ?? data.access_token ?? data.token;
  const refresh = data.refreshToken ?? refreshToken;
  setTokens(access, refresh);
  return access as string;
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && !original._retry) {
      // coordinate multiple 401s
      if (refreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(api(original)));
        });
      }

      original._retry = true;
      refreshing = true;
      try {
        const newAccess = await tryRefreshToken();
        // replay queued requests
        queue.forEach((cb) => cb());
        queue = [];
        // set header and retry the original
        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return api(original);
      } catch (e) {
        clearAuth();
        // fall through to reject
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// For /chathub (strip trailing /api)
export const chathubApi: AxiosInstance = axios.create({
  baseURL: API_BASE?.replace(/\/api\/?$/, ""),
  withCredentials: true,
});

// ---- Tiny typed helpers (no `any`) ----
type Primitive = string | number | boolean | null | undefined;
export type HttpParams = Record<string, Primitive>;
export type RequestBody = unknown;

export const http = {
  get<T>(path: string, params?: HttpParams, config?: AxiosRequestConfig): Promise<T> {
    return api.get<T>(path, { params, ...(config ?? {}) }).then((r) => r.data);
  },
  post<T, B = RequestBody>(path: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    return api.post<T>(path, body, config).then((r) => r.data);
  },
  put<T, B = RequestBody>(path: string, body?: B, config?: AxiosRequestConfig): Promise<T> {
    return api.put<T>(path, body, config).then((r) => r.data);
  },
  del<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    return api.delete<T>(path, config).then((r) => r.data);
  },
};

export default api;
