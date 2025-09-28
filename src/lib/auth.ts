// src/lib/auth.ts
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
export const AUTH_CHANGED = "auth:changed";

function notifyAuthChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED));
  }
}

export function setTokens(access?: string | null, refresh?: string | null): void {
  if (typeof window === "undefined") return;
  if (access === null) localStorage.removeItem(ACCESS_KEY);
  else if (typeof access === "string") localStorage.setItem(ACCESS_KEY, access);

  if (refresh === null) localStorage.removeItem(REFRESH_KEY);
  else if (typeof refresh === "string") localStorage.setItem(REFRESH_KEY, refresh);

  notifyAuthChanged();
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearAuth(): void {
  setTokens(null, null);
}

function base64UrlDecode(input: string): string {
  try {
    const pad = "=".repeat((4 - (input.length % 4)) % 4);
    const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
    return decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
} & Record<string, unknown>;

export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const json = base64UrlDecode(parts[1]);
  try {
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export type CurrentUser = { id?: number; email?: string; role?: string; name?: string; username?: string } | null;

export function getCurrentUser(): CurrentUser {
  const payload = decodeJwt(getAccessToken());
  if (!payload) return null;
  const id = typeof payload.sub === "string" ? parseInt(payload.sub, 10) : undefined;
  const email = typeof payload.email === "string" ? payload.email : undefined;
  const role =
    (payload.role as string | undefined) ??
    (payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string | undefined);
  const name = (payload.name as string | undefined);
  const username = (payload.username as string | undefined);
  const exp = typeof payload.exp === "number" ? payload.exp : undefined;
  if (exp && Date.now() / 1000 > exp) return null;
  return { id, email, role, name, username };
}
