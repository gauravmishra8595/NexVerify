"use client";

interface StatsCardProps {
  label: string;
  value: string | number;
  hint?: string;
  status?: "done" | "pending" | "locked";
}

const STATUS_STYLES = {
  done: "border-amber-500/20 bg-amber-500/5",
  pending: "border-white/10 bg-[#1E2640]",
  locked: "border-white/10 bg-[#1E2640] opacity-60",
};

const STATUS_DOT = {
  done: "bg-amber-400",
  pending: "bg-slate-500",
  locked: "bg-slate-700",
};

/**
 * A status/stat card for the candidate dashboard — shows a metric
 * (score, verification status, etc.) with an optional status indicator.
 */
export default function StatsCard({ label, value, hint, status = "pending" }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${STATUS_STYLES[status]}`}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      <p className="font-[family-name:--font-geist-mono] text-2xl font-semibold text-white">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
