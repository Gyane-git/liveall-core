"use client";

import { useState } from "react";
import { MOCK_SESSIONS } from "../types";

export default function SessionManagementView() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [revoking, setRevoking] = useState<string | null>(null);

  const revoke = async (id: string) => {
    setRevoking(id);
    await new Promise(r => setTimeout(r, 700));
    setSessions(s => s.filter(x => x.id !== id));
    setRevoking(null);
  };

  const revokeAll = async () => {
    setRevoking("all");
    await new Promise(r => setTimeout(r, 1000));
    setSessions(s => s.filter(x => x.current));
    setRevoking(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {sessions.length} active session{sessions.length !== 1 ? "s" : ""}
        </p>
        {sessions.length > 1 && (
          <button
            onClick={revokeAll}
            disabled={revoking === "all"}
            className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50 transition-colors"
          >
            {revoking === "all" ? "Signing out…" : "Sign out all others"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map(s => (
          <div
            key={s.id}
            className={`p-3.5 rounded-xl border transition-all ${
              s.current
                ? "border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20"
                : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{s.device}</p>
                  {s.current && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-medium">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{s.location} · {s.ip}</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">{s.lastActive}</p>
              </div>
              {!s.current && (
                <button
                  onClick={() => revoke(s.id)}
                  disabled={revoking === s.id}
                  className="text-xs text-red-500 hover:text-red-600 font-medium disabled:opacity-50 flex-shrink-0"
                >
                  {revoking === s.id ? "…" : "Revoke"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 1 && (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-600 py-2">
          No other active sessions
        </p>
      )}
    </div>
  );
}