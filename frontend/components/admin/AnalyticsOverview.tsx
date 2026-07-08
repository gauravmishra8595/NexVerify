"use client";

import { useEffect, useState } from "react";
import { fetchAnalyticsSummary } from "@/services/admin";
import type { AnalyticsSummary } from "@/types/admin";
import { Users, ShieldCheck, UserX, TrendingUp } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1E2640] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1E2640] p-5">
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-white/10" />
      <div className="h-7 w-16 animate-pulse rounded bg-white/10" />
    </div>
  );
}

export default function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsSummary()
      .then(setData)
      .catch(() => setError("Couldn't load analytics. Try refreshing."));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const verifiedRate =
    data.total_candidates > 0
      ? Math.round((data.verified_email_count / data.total_candidates) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label="Total Candidates"
        value={data.total_candidates.toLocaleString()}
        hint={`+${data.new_candidates_last_7_days} in last 7 days`}
      />
      <StatCard
        icon={ShieldCheck}
        label="Email Verified"
        value={`${verifiedRate}%`}
        hint={`${data.verified_email_count} of ${data.total_candidates} candidates`}
      />
      <StatCard
        icon={TrendingUp}
        label="Avg. Assessment Score"
        value={data.average_total_score != null ? data.average_total_score.toFixed(1) : "—"}
        hint={`${data.total_assessments_taken} assessments taken`}
      />
      <StatCard
        icon={UserX}
        label="Suspended Accounts"
        value={data.suspended_count.toLocaleString()}
        hint="Candidates blocked from logging in"
      />
    </div>
  );
}
