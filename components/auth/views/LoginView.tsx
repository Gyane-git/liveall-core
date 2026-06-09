"use client";

import { useState } from "react";
import FormField from "../ui/FormField";
import PasswordInput from "../ui/PasswordInput";
import { SubmitButton, Checkbox, inputClass } from "../ui/AuthButton";
import { AuthUser, AuthModalProps, MAX_LOGIN_ATTEMPTS, LOCK_DURATION_SECONDS, ROLE_PERMISSIONS } from "../types";

interface LoginViewProps {
  onSuccess: (u: AuthUser) => void;
  onForgotPassword: () => void;
  api?: AuthModalProps["api"];
}

export default function LoginView({ onSuccess, onForgotPassword, api }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const lockAccount = () => {
    setLocked(true);
    setCountdown(LOCK_DURATION_SECONDS);
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(iv); setLocked(false); setAttempts(0); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setError(""); setLoading(true);

    try {
      let user: AuthUser;
      if (api?.login) {
        user = await api.login(email, password);
      } else {
        await new Promise(r => setTimeout(r, 900));
        if (!email.includes("@") || password !== "Password123!") throw new Error("invalid");
        user = {
          id: "usr_" + Math.random().toString(36).slice(2, 9),
          name: email.split("@")[0].replace(/[._]/g, " "),
          email,
          role: "admin",
          permissions: ROLE_PERMISSIONS.admin,
          emailVerified: true,
          twoFactorEnabled: false,
          rememberMe,
          jwtToken: "eyJhbGci...demo_token",
        };
      }
      setLoading(false);
      onSuccess(user);
    } catch {
      setLoading(false);
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_LOGIN_ATTEMPTS) {
        lockAccount();
        setError(`Account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts.`);
      } else {
        setError(`Invalid credentials. ${MAX_LOGIN_ATTEMPTS - next} attempt${MAX_LOGIN_ATTEMPTS - next !== 1 ? "s" : ""} remaining.`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Lock banner */}
      {locked && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Account Temporarily Locked</p>
            <p className="text-xs text-red-500 mt-0.5">Retry in <span className="font-bold tabular-nums">{countdown}s</span></p>
          </div>
        </div>
      )}

      {/* Attempt bar */}
      {attempts > 0 && !locked && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Failed attempts</span>
            <span className={`font-medium ${attempts >= 3 ? "text-red-500" : "text-amber-500"}`}>{attempts}/{MAX_LOGIN_ATTEMPTS}</span>
          </div>
          <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${attempts >= 4 ? "bg-red-500" : attempts >= 2 ? "bg-amber-400" : "bg-yellow-300"}`}
              style={{ width: `${(attempts / MAX_LOGIN_ATTEMPTS) * 100}%` }}
            />
          </div>
        </div>
      )}

      <FormField label="Email address">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={locked}
          className={inputClass()}
        />
      </FormField>

      <FormField label="Password" error={error && !locked ? error : ""}>
        <PasswordInput value={password} onChange={setPassword} placeholder="Enter password" required disabled={locked} />
      </FormField>

      <div className="flex items-center justify-between">
        <Checkbox checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} label="Remember me" />
        <button type="button" onClick={onForgotPassword} className="text-sm text-violet-600 dark:text-violet-400 hover:underline font-medium">
          Forgot password?
        </button>
      </div>

      <SubmitButton loading={loading} disabled={locked}>
        {locked ? `Locked (${countdown}s)` : "Sign in"}
      </SubmitButton>

      <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800">
        <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">Demo credentials</p>
        <p className="text-xs text-violet-500 mt-0.5">any@email.com · Password: <code className="font-mono">Password123!</code></p>
      </div>
    </form>
  );
}