"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const baseInputClass =
  "w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 disabled:opacity-50";

export function TextField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      <input {...props} className={baseInputClass} />
    </div>
  );
}

export function PasswordField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-slate-400">{label}</label>
      <div className="relative">
        <input {...props} type={visible ? "text" : "password"} className={baseInputClass} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2.5 text-sm text-amber-300">
      {message}
    </div>
  );
}

export function SubmitButton({
  loading,
  loadingLabel,
  children,
}: {
  loading: boolean;
  loadingLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-amber-400 disabled:opacity-60"
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
