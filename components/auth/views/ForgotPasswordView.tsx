"use client";

import { useState } from "react";
import FormField from "../ui/FormField";
import { SubmitButton, inputClass } from "../ui/AuthButton";
import { AuthModalProps } from "../types";

interface ForgotPasswordViewProps {
  onBack: () => void;
  onSent: () => void;
  api?: AuthModalProps["api"];
}

export default function ForgotPasswordView({ onBack, onSent, api }: ForgotPasswordViewProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (api?.forgotPassword) await api.forgotPassword(email);
    else await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    setTimeout(onSent, 2000);
  };

  if (sent) return (
    <div className="text-center space-y-4 py-6">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-zinc-900 dark:text-white">Check your inbox</p>
        <p className="text-sm text-zinc-500 mt-1">
          Reset link sent to <span className="font-medium text-zinc-700 dark:text-zinc-300">{email}</span>
        </p>
      </div>
      <div className="flex justify-center gap-1">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Enter your email and we'll send a secure reset link.
      </p>

      <FormField label="Email address">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className={inputClass()}
        />
      </FormField>

      <SubmitButton loading={loading}>Send reset link</SubmitButton>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to sign in
      </button>
    </form>
  );
}