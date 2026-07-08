"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bell,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import useAdminAuth from "@/hooks/useAdminAuth";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Candidates", href: "/admin/candidates", icon: Users },
  { label: "Notification Logs", href: "/admin/notifications", icon: Bell },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const ready = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_access");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_username");
    router.push("/admin/login");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <p className="text-sm text-slate-400">Checking admin session...</p>
      </div>
    );
  }

  const username =
    typeof window !== "undefined" ? localStorage.getItem("admin_username") : null;

  const NavLinks = () => (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMobileNavOpen(false)}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-amber-500/10 text-amber-400"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#111827] text-white">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
          <span className="text-sm font-semibold">VerifyXY Admin</span>
        </div>
        <button onClick={() => setMobileNavOpen((v) => !v)} aria-label="Toggle menu">
          {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileNavOpen && (
        <div className="border-b border-white/10 px-4 py-3 md:hidden">
          <NavLinks />
        </div>
      )}

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 px-4 py-6 md:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-semibold">VerifyXY Admin</span>
          </div>

          <NavLinks />

          <div className="mt-auto border-t border-white/10 pt-4">
            {username && (
              <p className="mb-2 truncate px-2 text-xs text-slate-500">
                Signed in as <span className="text-slate-300">{username}</span>
              </p>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </aside>

        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
