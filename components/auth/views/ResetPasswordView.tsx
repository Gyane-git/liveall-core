"use client";

import { useState } from "react";
import FormField from "../ui/FormField";
import PasswordInput from "../ui/PasswordInput";
import PasswordStrengthMeter from "../ui/PasswordStrength";
import { SubmitButton } from "../ui/AuthButton";
import { AuthModalProps } from "../types";

interface ResetPasswordViewProps {
  onSuccess: () => void;
  api?: AuthModalProps["api"];
}

export default function ResetPasswordView({ onSuccess, api }: ResetPasswordViewProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    if (api?.resetPassword) await api.resetPassword("token_from_url", password);
    else await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    setTimeout(onSuccess, 1500);
  };

  if (done) return (
    <div className="text-center space-y-3 py-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="font-semibold text-zinc-900 dark:text-white">Password reset!</p>
      <p className="text-sm text-zinc-500">Redirecting to sign in…</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FormField label="New password">
          <PasswordInput value={password} onChange={setPassword} placeholder="Create new password" required />
        </FormField>
        {password && <PasswordStrengthMeter password={password} />}
      </div>

      <FormField label="Confirm new password" error={error}>
        <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" required />
      </FormField>

      <SubmitButton loading={loading}>Reset password</SubmitButton>
    </form>
  );
}