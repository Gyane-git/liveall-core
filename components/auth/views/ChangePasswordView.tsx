"use client";

import { useState } from "react";
import FormField from "../ui/FormField";
import PasswordInput from "../ui/PasswordInput";
import PasswordStrengthMeter from "../ui/PasswordStrength";
import { SubmitButton } from "../ui/AuthButton";
import { AuthModalProps } from "../types";

interface ChangePasswordViewProps {
  api?: AuthModalProps["api"];
}

export default function ChangePasswordView({ api }: ChangePasswordViewProps) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!api?.changePassword && current !== "Password123!") {
      setError("Current password is incorrect");
      return;
    }
    if (newPass !== confirm) { setError("New passwords do not match"); return; }
    setLoading(true);
    try {
      if (api?.changePassword) await api.changePassword(current, newPass);
      else await new Promise(r => setTimeout(r, 900));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    }
    setLoading(false);
  };

  if (success) return (
    <div className="text-center space-y-3 py-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="font-semibold text-zinc-900 dark:text-white">Password updated!</p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">All other sessions have been signed out.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5">
        <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
        </svg>
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Changing your password will sign out all other active sessions.
        </p>
      </div>

      <FormField label="Current password">
        <PasswordInput value={current} onChange={setCurrent} placeholder="Enter current password" required />
      </FormField>

      <div>
        <FormField label="New password">
          <PasswordInput value={newPass} onChange={setNewPass} placeholder="Create new password" required />
        </FormField>
        {newPass && <PasswordStrengthMeter password={newPass} />}
      </div>

      <FormField label="Confirm new password" error={error}>
        <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat new password" required />
      </FormField>

      <SubmitButton loading={loading}>Update password</SubmitButton>
    </form>
  );
}