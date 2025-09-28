// src/components/auth/AuthModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAuthModal } from "@/providers/auth-modal";
import { http } from "@/lib/api";
import { setTokens } from "@/lib/auth";

type LoginRes = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: string | Date;
};

export default function AuthModal() {
  const { open, hide, mode, setMode, showLogin } = useAuthModal();

  // shared
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // register-only
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [optIn, setOptIn] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => emailRef.current?.focus(), 0);
  }, [open, mode]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (open && ev.key === "Escape") hide(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, hide]);

  // Reset error whenever switching modes
  useEffect(() => {
    setErr(null);
  }, [mode]);

  if (!open) return null;

  const resetAll = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setUsername("");
    setConfirm("");
    setOptIn(false);
    setErr(null);
  };

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    if (!email || !password) { setErr("Email and password are required."); return; }
    setLoading(true);
    try {
      const data = await http.post<LoginRes>("/auth/login", { email, password });
      setTokens(data.accessToken, data.refreshToken ?? null);
      hide();
      resetAll();
    } catch {
      setErr("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

 async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setErr(null);

  // client checks (keep as you have them)
  if (!fullName.trim()) { setErr("Please enter your full name."); return; }
  if (!username.trim()) { setErr("Please choose a username."); return; }
  if (!email || !password) { setErr("Email and password are required."); return; }
  if (password.length < 6) { setErr("Password must be at least 6 characters."); return; }
  if (password !== confirm) { setErr("Passwords do not match."); return; }

  setLoading(true);
  try {
    // ➜ send the fields your API expects now
    await http.post("/auth/register", {
      email,
      password,
      username,
      fullName,
      marketingOptIn: optIn,
    });

    // auto-login
    const data = await http.post<LoginRes>("/auth/login", { email, password });
    setTokens(data.accessToken, data.refreshToken ?? null);
    hide();
    // clear local state...
  } catch (ex) {
    // try to show the server's error text if available
    const msg =
      (ex as { response?: { data?: unknown; status?: number } })?.response?.data ??
      "Could not register. Email or username may already be in use.";
    setErr(typeof msg === "string" ? msg : "Could not register. Email or username may already be in use.");
  } finally {
    setLoading(false);
  }
}

  const switchToRegister = () => setMode("register");

  const FooterSwitch = () => (
    <p className="pt-3 text-xs text-muted-foreground">
      {mode === "login" ? (
        <>
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={switchToRegister}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Sign up
          </button>
        </>
      ) : (
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={showLogin}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Log in
          </button>
        </>
      )}
    </p>
  );

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <button
        aria-label="Close"
        type="button"
        onClick={hide}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative z-[101] w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === "login" ? "Log in" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Welcome back to LuxeRide." : "Join LuxeRide to get started."}
            </p>
          </div>
          <button
            aria-label="Close"
            type="button"
            onClick={hide}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Forms */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {err && <p className="text-sm text-red-500">{err}</p>}

            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={hide}
                disabled={loading}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <FooterSwitch />
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                placeholder="Jane Doe"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="janedoe"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-email" className="text-sm font-medium">Email</label>
              <input
                ref={emailRef}
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-password" className="text-sm font-medium">Password</label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="At least 6 characters"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reg-confirm" className="text-sm font-medium">Confirm password</label>
              <input
                id="reg-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                placeholder="Repeat your password"
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Opt-in & Legal */}
            <div className="flex items-start gap-2">
              <input
                id="optin"
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                disabled={loading}
                className="mt-1 h-4 w-4 rounded border-input"
              />
              <label htmlFor="optin" className="text-sm">
                I’d like to receive news and updates.
              </label>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="/privacy" className="underline underline-offset-2">Privacy Policy</a>{" "}
              and{" "}
              <a href="/terms" className="underline underline-offset-2">Terms of Service</a>.
            </p>

            {err && <p className="text-sm text-red-500">{err}</p>}

            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={hide}
                disabled={loading}
                className="rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>

            <FooterSwitch />
          </form>
        )}
      </div>
    </div>
  );
}
