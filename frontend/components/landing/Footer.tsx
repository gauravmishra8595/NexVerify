import { ShieldCheck } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 sm:flex-row">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
              VerifyXY
            </span>
          </div>
          <p className="max-w-xs text-sm text-slate-500">
            Verify Skills. Verify Identity. Hire Better.
          </p>
        </div>

        <div className="flex gap-12">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-slate-400 hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} VerifyXY. Built as a portfolio project.
        </p>
      </div>
    </footer>
  );
}
