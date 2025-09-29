"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, User, Menu, X, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import { getCurrentUser, getAccessToken, clearAuth } from "@/lib/auth";
import { useAuthModal } from "@/providers/auth-modal";

/** ---- Config central ---- */
// nr telefoni i showroom (vetem shifra + country code per wa.me)
const PHONE_E164 = "15551234567"; // +1 555 123 4567
const WHATSAPP_E164 = "15551234567"; // perdor te njejtin ose tjeter nqs ke
const DEFAULT_WA_TEXT = "Hi! I’m interested in a vehicle. Could you help me?";

/** detektim i thjesht per mobile */
const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    setMobile(isMob);
  }, []);
  return mobile;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const { showLogin } = useAuthModal();
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [copiedTel, setCopiedTel] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const isMobile = useIsMobile();

  const roleBadge =
    userRole && userRole !== "User" ? <span className="text-foreground/60">({userRole})</span> : null;

  // Leximi i user-it kur ndryshon auth
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
  }, []);

  const handleLogout = async () => {
    try {
      const token = getAccessToken();
      if (token) await api.post("/auth/logout");
    } catch {
      /* ignore */
    } finally {
      clearAuth();
      setIsOpen(false);
    }
  };

  /** ---- Call click ----
   * mobile -> hap dialer me tel:
   * desktop -> kopjon nr (me feedback)
   */
  const handleCall = () => {
    const telHref = `tel:+${PHONE_E164}`;
    if (isMobile) {
      window.location.href = telHref;
      return;
    }
    navigator.clipboard?.writeText(`+${PHONE_E164}`).then(() => {
      setCopiedTel(true);
      setTimeout(() => setCopiedTel(false), 1600);
    });
  };

  /** ---- WhatsApp click ----
   * mobile -> hap app-in (wa.me) me text
   * desktop -> hap WhatsApp Web; nqs bllokohet, kopjon msg + nr
   */
  const handleWhatsApp = () => {
    const msg = encodeURIComponent(DEFAULT_WA_TEXT);
    const waUrl = `https://wa.me/${WHATSAPP_E164}?text=${msg}`;
    if (isMobile) {
      window.location.href = waUrl;
      return;
    }
    const win = window.open(waUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      // nqs popup u blloku: copy nr + msg
      navigator.clipboard?.writeText(`WhatsApp +${WHATSAPP_E164}\n${DEFAULT_WA_TEXT}`).then(() => {
        setCopiedWa(true);
        setTimeout(() => setCopiedWa(false), 1600);
      });
    }
  };

  const LoggedOutActions = (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={showLogin}
        className="flex items-center gap-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-dark"
      >
        <User className="w-4 h-4" />
        Login
      </Button>
    </>
  );

  const LoggedInActions = (
    <div className="flex items-center gap-4">
      {/* User chip + name */}
      <div className="flex items-center max-w-[240px]">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-white/10 text-brand-white"
          aria-hidden="true"
        >
          <User className="w-5 h-5" />
        </span>
        <span className="truncate text-sm text-foreground/80 hidden md:inline" title={displayName ?? ""}>
          {displayName} {roleBadge}
        </span>
      </div>

      {userRole === "Admin" && (
        <Button asChild variant="ghost" size="sm" className="text-foreground hover:text-brand-white">
          <Link href="/a9f1c7e-admin">Admin Dashboard</Link>
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
          <Link href="/" className="text-2xl font-serif font-bold bg-gradient-luxury bg-clip-text text-transparent">
            LuxeRide
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link href="/" className="text-foreground hover:text-brand-white transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-foreground hover:text-brand-white transition-colors">
              Pricing
            </Link>
            <Link href="#contact" className="text-foreground hover:text-brand-white transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className="text-foreground hover:text-brand-white"
            aria-label={`Call +${PHONE_E164}`}
            title={copiedTel ? "Copied!" : `+${PHONE_E164}`}
          >
            <Phone className="w-4 h-4 mr-2" />
            {copiedTel ? "Copied" : "Call"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleWhatsApp}
            className="text-foreground hover:text-brand-white"
            aria-label="Chat on WhatsApp"
            title={copiedWa ? "Copied!" : "WhatsApp"}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {copiedWa ? "Copied" : "WhatsApp"}
          </Button>

          {/* Auth-aware area */}
          {userEmail ? LoggedInActions : LoggedOutActions}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-foreground hover:text-brand-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
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
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2"
              onClick={() => {
                handleCall();
                setIsOpen(false);
              }}
            >
              <Phone className="w-4 h-4" />
              {copiedTel ? "Copied" : "Call"}
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-center gap-2"
              onClick={() => {
                handleWhatsApp();
                setIsOpen(false);
              }}
            >
              <MessageCircle className="w-4 h-4" />
              {copiedWa ? "Copied" : "WhatsApp"}
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
