// src/lib/api.ts
import axios from "axios";

/**
 * Use the same env var you already use elsewhere:
 *   NEXT_PUBLIC_API_BASE_URL = http://localhost:5077/api
 * or production domain with /api suffix.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

// Main API for /api/*
const api = axios.create({
  baseURL: API_BASE,          
  withCredentials: true,      
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) config.headers["X-Timezone"] = timezone;
  }
  return config;
});


export const http = {
  get:  <T = any>(path: string, params?: any) => api.get<T>(path, { params }).then(r => r.data),
  post: <T = any>(path: string, body?: any)   => api.post<T>(path, body).then(r => r.data),
  put:  <T = any>(path: string, body?: any)   => api.put<T>(path, body).then(r => r.data),
  del:  <T = any>(path: string)               => api.delete<T>(path).then(r => r.data),
};

export default api;
