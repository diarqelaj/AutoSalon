"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, Menu, X, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { getCurrentUser, getAccessToken, clearAuth } from "@/lib/auth";
import { useAuthModal } from "@/providers/auth-modal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const { showLogin, showRegister } = useAuthModal();
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const roleBadge = userRole && userRole !== "User"
  ? <span className="text-foreground/60">({userRole})</span>
  : null;
  // Leximi i JWT tokenit edhe sa her ndyrshon
  useEffect(() => {
  const apply = () => {
    const u = getCurrentUser();
    setUserEmail(u?.email);
    setUserRole(u?.role);
    setDisplayName(u?.name || u?.username || u?.email);
  };
  apply();

  const handler = () => apply();
  window.addEventListener("auth:changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("auth:changed", handler);
    window.removeEventListener("storage", handler);
  };
}, [])

  const handleLogout = async () => {
    try {
      // call API logout (optional, but good to invalidate refresh)
      const token = getAccessToken();
      if (token) {
        await api.post("/auth/logout"); // Authorization header is auto-attached by api.ts
      }
    } catch {
      // ignore network errors; we'll still clear locally
    } finally {
      clearAuth();
      setIsOpen(false);
    }
  };

  const LoggedOutActions = (
    <>
      <Button variant="outline" size="sm" onClick={showLogin} className="flex items-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark">
  <User className="w-4 h-4" />
  Login
</Button>
    </>
  );

  const LoggedInActions = (
  <div className="flex items-center gap-3">
    <span
      className="max-w-[200px] truncate text-sm text-foreground/80 hidden md:inline"
      title={displayName ?? ""}
    >
      {displayName} {roleBadge}
    </span>

    {userRole === "Admin" && (
      <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-brand-white">
        <Link href="/admin">Admin</Link>
      </Button>
    )}

    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  </div>
);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo + Links */}
        <div className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent"
          >
            LuxeRide
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-brand-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-brand-white"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground hover:text-brand-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>

          {/* Auth-aware area */}
          {userEmail ? LoggedInActions : LoggedOutActions}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-foreground hover:text-brand-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 py-6 space-y-4">
          <Link href="/fleet" className="block text-foreground hover:text-brand-white" onClick={() => setIsOpen(false)}>
            Fleet
          </Link>
          <Link href="/pricing" className="block text-foreground hover:text-brand-white" onClick={() => setIsOpen(false)}>
            Pricing
          </Link>
          <Link href="#contact" className="block text-foreground hover:text-brand-white" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <Button variant="ghost" className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call
            </Button>
            <Button variant="ghost" className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>

            {/* Mobile auth-aware */}
            {!userEmail ? (
              <Button
                asChild
                variant="outline"
                className="flex items-center justify-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
                onClick={() => setIsOpen(false)}
              >
                <Link href="/login">
                  <User className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                {userRole === "Admin" && (
                  <Button asChild variant="ghost" onClick={() => setIsOpen(false)}>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
