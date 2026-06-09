"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AuthModalProps, AuthUser, AuthView, VIEW_META } from "./types";

import LoginView from "./views/LoginView";
import SignupView from "./views/SignupView";
import ForgotPasswordView from "./views/ForgotPasswordView";
import ResetPasswordView from "./views/ResetPasswordView";
import ChangePasswordView from "./views/ChangePasswordView";
import EmailVerificationView from "./views/EmailVerificationView";
import TwoFactorView from "./views/TwoFactorView";
import SessionManagementView from "./views/SessionManagementView";
import RoleAccessView from "./views/RoleAccessView";

export default function AuthModal({
  isOpen,
  onClose,
  initialView = "login",
  onSuccess,
  api,
}: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, initialView]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  const handleLoginSuccess = useCallback((u: AuthUser) => {
    setUser(u);
    if (u.twoFactorEnabled) setView("2fa");
    else if (!u.emailVerified) setView("email-verification");
    else { onSuccess?.(u); onClose(); }
  }, [onSuccess, onClose]);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setUser(null);
      setIsLoggingOut(false);
      setView("login");
    }, 1000);
  }, []);

  if (!isOpen) return null;

  const meta = VIEW_META[view];

  return (
    <>
      <div
        ref={overlayRef}
        onClick={e => { if (e.target === overlayRef.current) onClose(); }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <div
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
          style={{ animation: "authModalIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both", maxHeight: "95vh", overflowY: "auto" }}
        >
          {/* Accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{meta.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">{meta.title}</h2>
                {user && <p className="text-xs text-zinc-400">{user.email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium disabled:opacity-60"
                >
                  {isLoggingOut ? "Signing out…" : "Sign out"}
                </button>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Post-login nav */}
          {user && (
            <div className="flex gap-1 px-6 pb-2 overflow-x-auto no-scrollbar">
              {(["session-management", "role-access", "change-password", "2fa"] as AuthView[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                    view === v
                      ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {v === "session-management" ? "Sessions" : v === "role-access" ? "Roles" : v === "change-password" ? "Password" : "2FA"}
                </button>
              ))}
            </div>
          )}

          <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-6" />

          {/* View */}
          <div className="p-6">
            {view === "login" && (
              <LoginView onSuccess={handleLoginSuccess} onForgotPassword={() => setView("forgot-password")} api={api} />
            )}
            {view === "signup" && (
              <SignupView onSuccess={handleLoginSuccess} onLogin={() => setView("login")} api={api} />
            )}
            {view === "forgot-password" && (
              <ForgotPasswordView onBack={() => setView("login")} onSent={() => setView("reset-password")} api={api} />
            )}
            {view === "reset-password" && (
              <ResetPasswordView onSuccess={() => setView("login")} api={api} />
            )}
            {view === "change-password" && (
              <ChangePasswordView api={api} />
            )}
            {view === "email-verification" && (
              <EmailVerificationView
                email={user?.email || ""}
                onVerified={() => { if (user) { onSuccess?.({ ...user, emailVerified: true }); onClose(); } }}
                api={api}
              />
            )}
            {view === "2fa" && (
              <TwoFactorView
                onVerified={() => {
                  if (user) {
                    if (!user.emailVerified) setView("email-verification");
                    else { onSuccess?.(user); onClose(); }
                  }
                }}
                api={api}
              />
            )}
            {view === "session-management" && <SessionManagementView />}
            {view === "role-access" && <RoleAccessView userRole={user?.role || "viewer"} />}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 flex items-center justify-between">
            <p className="text-xs text-zinc-400 dark:text-zinc-600">🔒 JWT · Encrypted</p>
            {!user && (
              <button
                onClick={() => setView(v => v === "login" ? "signup" : "login")}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium"
              >
                {view === "login" ? "New user? Sign up" : view === "signup" ? "Have account? Login" : ""}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes authModalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}