"use client";

import { useState } from "react";
import { SubmitButton } from "../ui/AuthButton";
import { AuthModalProps } from "../types";

interface TwoFactorViewProps {
  onVerified: () => void;
  api?: AuthModalProps["api"];
}

export default function TwoFactorView({ onVerified, api }: TwoFactorViewProps) {
  const [method, setMethod] = useState<"totp" | "backup">("totp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length < (method === "totp" ? 6 : 8)) {
      setError(`Enter a valid ${method === "totp" ? "6-digit" : "8-character"} code`);
      return;
    }
    setLoading(true);
    try {
      if (api?.verify2FA) await api.verify2FA(code);
      else {
        await new Promise(r => setTimeout(r, 900));
        if (["000000", "00000000"].includes(code)) throw new Error("Invalid code");
      }
      onVerified();
    } catch (err: any) {
      setError(err.message || "Invalid code");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {method === "totp"
            ? "Enter the 6-digit code from your authenticator app"
            : "Enter one of your backup recovery codes"}
        </p>
      </div>

      <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {(["totp", "backup"] as const).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => { setMethod(m); setCode(""); setError(""); }}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              method === m
                ? "bg-violet-600 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            {m === "totp" ? "📱 Authenticator" : "🔑 Backup code"}
          </button>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={code}
          onChange={e =>
            setCode(
              method === "totp"
                ? e.target.value.replace(/\D/g, "").slice(0, 6)
                : e.target.value.toUpperCase().slice(0, 8)
            )
          }
          placeholder={method === "totp" ? "000000" : "XXXXXXXX"}
          className="w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.4em] rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"
        />
        {error && <p className="mt-1.5 text-sm text-red-500 text-center">{error}</p>}
      </div>

      <SubmitButton loading={loading}>Verify</SubmitButton>

      <p className="text-xs text-center text-zinc-400 dark:text-zinc-600">
        Compatible with Google Authenticator, Authy, 1Password
      </p>
    </form>
  );
}