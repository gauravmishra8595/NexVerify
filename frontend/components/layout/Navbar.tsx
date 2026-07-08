"use client";

import { ShieldCheck, LogOut, User } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ROUTES } from "@/lib/constants";

/**
 * Candidate-facing top navbar — shown on authenticated pages
 * (dashboard, assessment, resume, etc.). Reads the logged-in user
 * from the DB via useCurrentUser, not from localStorage.
 *
 * Note: Admin pages use AdminShell instead of this component.
 */
export default function Navbar() {
  const { user } = useCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = ROUTES.LOGIN;
  };

  return (
    <header className="border-b border-white/10 bg-[#111827]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href={ROUTES.HOME} className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
            VerifyXY
          </span>
        </a>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/10">
                <User className="h-3.5 w-3.5 text-amber-400" />
              </div>
              <span className="text-sm text-slate-300">{user.username}</span>
              {user.is_email_verified && (
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400">
                  Verified
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
