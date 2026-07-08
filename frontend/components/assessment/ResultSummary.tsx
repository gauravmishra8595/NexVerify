"use client";

import { useEffect, useState } from "react";
import { fetchMyLatestResult } from "@/services/assessment";
import type { AssessmentResultData } from "@/types/assessment";
import { Trophy, Code2, Brain, AlertCircle } from "lucide-react";
import Starfield from "@/components/ui-custom/Starfield";

function ScoreCard({
  label,
  score,
  max,
  icon: Icon,
}: {
  label: string;
  score: number;
  max: number;
  icon: React.ElementType;
}) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;

  return (
    <div className="rounded-xl border border-white/10 bg-[#1E2640] p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <p className="font-[family-name:--font-geist-mono] text-2xl font-semibold text-white">
        {score}
        <span className="text-base font-normal text-slate-500">/{max}</span>
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-amber-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultSummary() {
  const [result, setResult] = useState<AssessmentResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyLatestResult()
      .then(setResult)
      .catch((err) => {
        if (err?.response?.status === 404) {
          setError("You haven't completed any assessments yet.");
        } else {
          setError("Couldn't load your results. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <p className="text-sm text-slate-400">Loading your results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827] p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1E2640] p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-slate-500" />
          <p className="mb-5 text-sm text-slate-300">{error}</p>
          <a
            href="/dashboard"
            className="inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827] p-6">
      <Starfield density="sparse" />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-[80px]"
      />

      <div className="relative mx-auto max-w-2xl py-12">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/6">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white">Your assessment results</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Completed on {new Date(result.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <ScoreCard label="DSA Score" score={result.dsa_score} max={50} icon={Code2} />
          <ScoreCard label="Aptitude Score" score={result.aptitude_score} max={50} icon={Brain} />
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-6 text-center">
          <p className="text-sm text-slate-400">Total Score</p>
          <p className="mt-1 font-[family-name:--font-geist-mono] text-4xl font-semibold text-white">
            {result.total_score}
            <span className="text-xl text-slate-500">/100</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">
            DSA: {result.dsa_score}/50 · Aptitude: {result.aptitude_score}/50 · 2 marks per correct answer
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="/resume"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
          >
            Continue to Resume Upload
          </a>
          <a
            href="/dashboard"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
