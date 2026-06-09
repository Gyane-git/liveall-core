"use client";

import { useState, useRef } from "react";
import { SubmitButton } from "../ui/AuthButton";
import { AuthModalProps } from "../types";

interface EmailVerificationViewProps {
  email: string;
  onVerified: () => void;
  api?: AuthModalProps["api"];
}

export default function EmailVerificationView({ email, onVerified, api }: EmailVerificationViewProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length) {
      setCode(p.split("").concat(Array(6).fill("")).slice(0, 6));
      inputs.current[Math.min(p.length, 5)]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const full = code.join("");
    if (full.length !== 6) { setError("Enter all 6 digits"); return; }
    setError(""); setLoading(true);
    try {
      if (api?.verifyEmail) await api.verifyEmail(full);
      else {
        await new Promise(r => setTimeout(r, 900));
        if (full === "000000") throw new Error("Invalid code");
      }
      onVerified();
    } catch (err: any) {
      setError(err.message || "Invalid code");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          6-digit code sent to{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
        </p>
      </div>

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {code.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className={`w-11 h-12 text-center text-lg font-semibold rounded-xl border-2 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none transition-all ${
              d
                ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                : "border-zinc-200 dark:border-zinc-700 focus:border-violet-400"
            }`}
          />
        ))}
      </div>

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      <SubmitButton loading={loading}>Verify email</SubmitButton>

      <p className="text-center text-sm">
        {resent ? (
          <span className="text-green-500 font-medium">✓ Code resent!</span>
        ) : (
          <button type="button" onClick={handleResend} className="text-violet-600 dark:text-violet-400 hover:underline">
            Didn't receive it? Resend code
          </button>
        )}
      </p>

      <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
        Demo: any 6-digit code except 000000 works
      </p>
    </form>
  );
}