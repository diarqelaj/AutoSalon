// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// e.g. NEXT_PUBLIC_API_BASE_URL=http://localhost:5077/api
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

// ---- Axios instances ----
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Attach timezone header (browser only)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) config.headers["X-Timezone"] = tz;
  }
  return config;
});

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
