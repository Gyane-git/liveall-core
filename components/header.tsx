"use client";

import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { AuthUser } from "@/components/auth/types";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const handleAuthSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  return (
    <>
      <header className="flex items-center justify-between bg-white border-b px-6 py-4 text-gray-600">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Namaste Nepal</h1>
          <p className="text-sm text-gray-500">Welcome to the dashboard</p>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell size={22} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User button — click to open AuthModal */}
          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {currentUser ? (
                <span className="text-sm font-semibold text-gray-700 uppercase">
                  {currentUser.name.charAt(0)}
                </span>
              ) : (
                <User size={18} />
              )}
            </div>

            <div className="hidden md:block text-left">
              <p className="font-medium text-sm">
                {currentUser ? currentUser.name : "Demo User"}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser ? currentUser.role : "user"}
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialView={currentUser ? "session-management" : "login"}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}