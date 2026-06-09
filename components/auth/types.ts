// ─────────────────────────────────────────────────────────────────────────────
// SHARED TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export type AuthView =
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "change-password"
  | "email-verification"
  | "2fa"
  | "session-management"
  | "role-access";

export type UserRole = "admin" | "editor" | "viewer" | "moderator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  rememberMe: boolean;
  jwtToken?: string;
}

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  onSuccess?: (user: AuthUser) => void;
  api?: {
    login?: (email: string, password: string) => Promise<AuthUser>;
    signup?: (name: string, email: string, password: string, role: UserRole) => Promise<AuthUser>;
    forgotPassword?: (email: string) => Promise<void>;
    resetPassword?: (token: string, password: string) => Promise<void>;
    changePassword?: (current: string, next: string) => Promise<void>;
    verifyEmail?: (code: string) => Promise<void>;
    verify2FA?: (code: string) => Promise<void>;
  };
}

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_SECONDS = 30;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ["read", "write", "delete", "manage_users", "manage_roles"],
  moderator: ["read", "write", "moderate"],
  editor: ["read", "write"],
  viewer: ["read"],
};

export const MOCK_SESSIONS = [
  { id: "s1", device: "Chrome on macOS", location: "Kathmandu, NP", ip: "192.168.1.1", lastActive: "Active now", current: true, icon: "🖥️" },
  { id: "s2", device: "Safari on iPhone 15", location: "Kathmandu, NP", ip: "192.168.1.54", lastActive: "2h ago", current: false, icon: "📱" },
  { id: "s3", device: "Firefox on Windows", location: "Pokhara, NP", ip: "10.0.0.22", lastActive: "Yesterday", current: false, icon: "💻" },
  { id: "s4", device: "Chrome on Android", location: "Unknown", ip: "203.0.113.12", lastActive: "3 days ago", current: false, icon: "📱" },
];

export const VIEW_META: Record<AuthView, { title: string; icon: string }> = {
  login: { title: "Welcome back", icon: "🔐" },
  signup: { title: "Create account", icon: "✨" },
  "forgot-password": { title: "Reset password", icon: "📧" },
  "reset-password": { title: "New password", icon: "🔑" },
  "change-password": { title: "Change password", icon: "🛡️" },
  "email-verification": { title: "Verify email", icon: "📬" },
  "2fa": { title: "Two-factor auth", icon: "📱" },
  "session-management": { title: "Active sessions", icon: "🖥️" },
  "role-access": { title: "Roles & permissions", icon: "👑" },
};

export const ROLE_META = [
  { role: "admin" as UserRole, label: "Admin", col: "text-violet-700 dark:text-violet-300" },
  { role: "moderator" as UserRole, label: "Moderator", col: "text-blue-700 dark:text-blue-300" },
  { role: "editor" as UserRole, label: "Editor", col: "text-amber-700 dark:text-amber-300" },
  { role: "viewer" as UserRole, label: "Viewer", col: "text-zinc-600 dark:text-zinc-400" },
];

export const PERM_MATRIX = [
  { key: "read", label: "Read", icon: "👁️", roles: ["admin", "moderator", "editor", "viewer"] },
  { key: "write", label: "Write", icon: "✏️", roles: ["admin", "moderator", "editor"] },
  { key: "moderate", label: "Moderate", icon: "🛡️", roles: ["admin", "moderator"] },
  { key: "delete", label: "Delete", icon: "🗑️", roles: ["admin"] },
  { key: "manage_users", label: "Manage Users", icon: "👥", roles: ["admin"] },
  { key: "manage_roles", label: "Manage Roles", icon: "👑", roles: ["admin"] },
];