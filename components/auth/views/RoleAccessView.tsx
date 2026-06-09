"use client";

import { UserRole, ROLE_META, PERM_MATRIX } from "../types";

interface RoleAccessViewProps {
  userRole: UserRole;
}

export default function RoleAccessView({ userRole }: RoleAccessViewProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700">
        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
          <span className="text-lg">👑</span>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Your current role</p>
          <p className={`text-sm font-semibold ${ROLE_META.find(r => r.role === userRole)?.col}`}>
            {ROLE_META.find(r => r.role === userRole)?.label}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
          Permission Matrix
        </p>
        <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <div
            className="grid border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
            style={{ gridTemplateColumns: "1fr repeat(4, auto)" }}
          >
            <div className="px-3 py-2 text-xs font-medium text-zinc-400">Permission</div>
            {ROLE_META.map(r => (
              <div key={r.role} className="px-2 py-2 text-center">
                <span className={`text-xs font-medium ${r.col}`}>{r.label}</span>
              </div>
            ))}
          </div>

          {PERM_MATRIX.map(p => (
            <div
              key={p.key}
              className={`grid items-center border-b last:border-0 border-zinc-100 dark:border-zinc-800 ${
                p.roles.includes(userRole) ? "bg-violet-50/50 dark:bg-violet-900/10" : ""
              }`}
              style={{ gridTemplateColumns: "1fr repeat(4, auto)" }}
            >
              <div className="px-3 py-2.5 flex items-center gap-2">
                <span className="text-sm">{p.icon}</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300">{p.label}</span>
              </div>
              {ROLE_META.map(r => (
                <div key={r.role} className="px-4 py-2.5 flex justify-center">
                  {p.roles.includes(r.role) ? (
                    <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-zinc-400 dark:text-zinc-600 text-center">
        Role assignments are managed by your administrator
      </p>
    </div>
  );
}