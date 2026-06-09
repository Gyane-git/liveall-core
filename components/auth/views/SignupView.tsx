"use client";

import { useState } from "react";
import FormField from "../ui/FormField";
import PasswordInput from "../ui/PasswordInput";
import PasswordStrengthMeter from "../ui/PasswordStrength";
import { SubmitButton, Checkbox, inputClass } from "../ui/AuthButton";
import { AuthUser, AuthModalProps, UserRole, ROLE_PERMISSIONS } from "../types";

interface SignupViewProps {
  onSuccess: (u: AuthUser) => void;
  onLogin: () => void;
  api?: AuthModalProps["api"];
}

export default function SignupView({ onSuccess, onLogin, api }: SignupViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (!agreed) { setError("Please accept the terms"); return; }
    setLoading(true);
    try {
      let user: AuthUser;
      if (api?.signup) {
        user = await api.signup(name, email, password, role);
      } else {
        await new Promise(r => setTimeout(r, 1000));
        user = {
          id: "usr_" + Math.random().toString(36).slice(2, 9),
          name, email, role,
          permissions: ROLE_PERMISSIONS[role],
          emailVerified: false,
          twoFactorEnabled: false,
          rememberMe: false,
        };
      }
      setLoading(false);
      onSuccess(user);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Full name">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required className={inputClass()} />
      </FormField>

      <FormField label="Email address">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className={inputClass()} />
      </FormField>

      <FormField label="Role">
        <select value={role} onChange={e => setRole(e.target.value as UserRole)} className={inputClass()}>
          <option value="viewer">Viewer — Read only</option>
          <option value="editor">Editor — Read & Write</option>
          <option value="moderator">Moderator — Read, Write & Moderate</option>
          <option value="admin">Admin — Full access</option>
        </select>
      </FormField>

      <div>
        <FormField label="Password">
          <PasswordInput value={password} onChange={setPassword} placeholder="Create a strong password" required />
        </FormField>
        {password && <PasswordStrengthMeter password={password} />}
      </div>

      <FormField label="Confirm password" error={error}>
        <PasswordInput value={confirm} onChange={setConfirm} placeholder="Repeat password" required />
      </FormField>

      <Checkbox
        checked={agreed}
        onChange={() => setAgreed(!agreed)}
        label={
          <>
            I agree to the{" "}
            <span className="text-violet-600 dark:text-violet-400 font-medium">Terms</span>
            {" "}and{" "}
            <span className="text-violet-600 dark:text-violet-400 font-medium">Privacy Policy</span>
          </>
        }
      />

      <SubmitButton loading={loading}>Create account</SubmitButton>

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <button type="button" onClick={onLogin} className="text-violet-600 dark:text-violet-400 hover:underline font-medium">
          Sign in
        </button>
      </p>
    </form>
  );
}