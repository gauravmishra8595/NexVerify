import { ShieldCheck } from "lucide-react";
import Starfield from "./Starfield";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111827] px-4 py-12">
      <Starfield density="sparse" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-[80px]"
      />

      <div className="relative w-full max-w-md">
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
            VerifyXY
          </span>
        </a>

        <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-white">{title}</h1>
            <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
          </div>

          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
