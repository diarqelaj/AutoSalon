"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type AuthMode = "login" | "register";

type Ctx = {
  open: boolean;
  mode: AuthMode;
  showLogin: () => void;
  showRegister: () => void;
  setMode: (m: AuthMode) => void;
  hide: () => void;
};

const AuthModalCtx = createContext<Ctx | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const showLogin = useCallback(() => { setMode("login"); setOpen(true); }, []);
  const showRegister = useCallback(() => { setMode("register"); setOpen(true); }, []);
  const hide = useCallback(() => setOpen(false), []);

  return (
    <AuthModalCtx.Provider value={{ open, mode, showLogin, showRegister, setMode, hide }}>
      {children}
    </AuthModalCtx.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalCtx);
  if (!ctx) throw new Error("useAuthModal must be used within <AuthModalProvider>");
  return ctx;
}
