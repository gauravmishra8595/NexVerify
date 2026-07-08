"use client";

import type { AssessmentResultData } from "@/types/assessment";
import ResultChart from "@/components/assessment/ResultChart";
import { Award, Code2, Brain } from "lucide-react";

interface CandidateReportProps {
  result: AssessmentResultData;
  candidateName?: string;
}

/**
 * A full summary report card combining DSA score, aptitude score,
 * and the recharts bar chart. Designed to embed on the /result page
 * or anywhere that needs a compact result summary.
 */
export default function CandidateReport({ result, candidateName }: CandidateReportProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6">
      {candidateName && (
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400" />
          <p className="text-sm font-medium text-white">{candidateName}</p>
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
          <div className="mb-1 flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-xs text-slate-400">DSA</p>
          </div>
          <p className="font-[family-name:--font-geist-mono] text-2xl font-semibold text-white">
            {result.dsa_score}
            <span className="text-sm text-slate-500">/50</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
          <div className="mb-1 flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-xs text-slate-400">Aptitude</p>
          </div>
          <p className="font-[family-name:--font-geist-mono] text-2xl font-semibold text-white">
            {result.aptitude_score}
            <span className="text-sm text-slate-500">/50</span>
          </p>
        </div>
      </div>

      <ResultChart
        dsaScore={result.dsa_score}
        aptitudeScore={result.aptitude_score}
        maxScore={25}
      />

      <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-center">
        <p className="text-xs text-slate-400">Total</p>
        <p className="font-[family-name:--font-geist-mono] text-3xl font-semibold text-white">
          {result.total_score}
          <span className="text-base text-slate-500">/100</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">2 marks per correct answer</p>
      </div>
    </div>
  );
}
