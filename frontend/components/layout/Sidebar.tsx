"use client";

import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Code2,
  Brain,
  FileText,
  BarChart2,
  LayoutDashboard,
} from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard, desc: "Verify email" },
  { label: "DSA Assessment", href: ROUTES.DSA, icon: Code2, desc: "25 questions" },
  { label: "Aptitude", href: ROUTES.APTITUDE, icon: Brain, desc: "25 questions" },
  { label: "Resume", href: ROUTES.RESUME, icon: FileText, desc: "Upload + parse" },
  { label: "Analysis", href: ROUTES.ANALYSIS, icon: BarChart2, desc: "ATS scoring" },
];

/**
 * Candidate sidebar for the authenticated app flow.
 * Shows the step-by-step progression from verification through certificate.
 * The admin panel uses AdminShell instead of this component.
 */
export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useCurrentUser();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-white/10 px-4 py-6 lg:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <ShieldCheck className="h-5 w-5 text-amber-400" />
        <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
          VerifyXY
        </span>
      </div>

      {user && (
        <div className="mb-5 rounded-lg border border-white/10 bg-[#1E2640] px-3 py-2.5">
          <p className="text-xs font-medium text-slate-200">{user.username}</p>
          <p className="mt-0.5 truncate text-[11px] text-slate-500">{user.email}</p>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <p className="leading-tight">{item.label}</p>
                <p className="text-[10px] opacity-60">{item.desc}</p>
              </div>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
