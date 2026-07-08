"use client";

import { useEffect, useState } from "react";
import { runResumeAnalysis, fetchMyLatestAnalysis } from "@/services/analysis";
import type { CandidateAnalysis } from "@/types/analysis";
import { RadarScoreChart, BarScoreChart, OverallPieChart } from "./AnalysisCharts";
import Starfield from "@/components/ui-custom/Starfield";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Tag,
  Loader2,
  RefreshCw,
} from "lucide-react";

function ScoreChip({ label, score }: { label: string; score: number }) {
  const tone =
    score >= 75 ? "text-amber-400 bg-amber-500/10" : score >= 50 ? "text-slate-300 bg-white/5" : "text-red-400 bg-red-500/10";

  return (
    <div className="rounded-xl border border-white/10 bg-[#1E2640] p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 font-[family-name:--font-geist-mono] text-lg font-semibold ${tone}`}>
        {score}
      </p>
    </div>
  );
}

export default function AnalysisResult() {
  const [analysis, setAnalysis] = useState<CandidateAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyLatestAnalysis()
      .then(setAnalysis)
      .catch(() => {
        // 404 just means no analysis yet - handled by the empty state below.
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRun = async () => {
    setError(null);
    setRunning(true);

    try {
      const result = await runResumeAnalysis();
      setAnalysis(result);
    } catch (err: any) {
      const backendError = err?.response?.data?.error;
      setError(backendError || "Couldn't run analysis. Please try again.");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827]">
        <p className="text-sm text-slate-400">Loading your analysis...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827] p-6">
      <Starfield density="sparse" />

      <div className="relative mx-auto max-w-4xl py-12">
        <div className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10">
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white">AI Resume Analysis</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            ATS readiness, skill match, and improvement suggestions for your resume.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!analysis && (
          <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-10 text-center">
            <p className="mb-5 text-sm text-slate-400">
              You haven&apos;t run an analysis yet. This reads your uploaded resume
              and scores it across six dimensions.
            </p>
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400 disabled:opacity-60"
            >
              {running ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Run analysis"
              )}
            </button>
            <p className="mt-4 text-xs text-slate-500">
              No resume uploaded yet?{" "}
              <a href="/resume" className="text-amber-400 hover:underline">
                Upload one first
              </a>
              .
            </p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            {/* Overview row: pie + score grid */}
            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
              <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6 text-center">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Overall Score
                </p>
                <OverallPieChart overallScore={analysis.overall_score} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <ScoreChip label="ATS Score" score={analysis.ats_score} />
                <ScoreChip label="Grammar" score={analysis.grammar_score} />
                <ScoreChip label="Skill Match" score={analysis.skill_match_score} />
                <ScoreChip label="Project Quality" score={analysis.project_quality_score} />
                <ScoreChip label="Experience" score={analysis.experience_score} />
                <ScoreChip label="Projects" score={analysis.project_score} />
              </div>
            </div>

            {/* Charts row */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-5">
                <p className="mb-2 text-sm font-medium text-slate-300">Score breakdown</p>
                <RadarScoreChart analysis={analysis} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-5">
                <p className="mb-2 text-sm font-medium text-slate-300">Score comparison</p>
                <BarScoreChart analysis={analysis} />
              </div>
            </div>

            {/* Recommendation */}
            {analysis.recommendation && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                  <p className="text-sm font-medium text-white">Recommendation</p>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{analysis.recommendation}</p>
              </div>
            )}

            {/* Strengths + Improvements */}
            <div className="grid gap-5 sm:grid-cols-2">
              {analysis.strengths.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    <p className="text-sm font-medium text-white">Strengths</p>
                  </div>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-slate-300">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.improvements.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <p className="text-sm font-medium text-white">Improvements</p>
                  </div>
                  <ul className="space-y-2">
                    {analysis.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-slate-300">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Keywords + missing skills */}
            {(analysis.keyword_analysis.matched.length > 0 ||
              analysis.keyword_analysis.missing.length > 0 ||
              analysis.missing_skills.length > 0) && (
              <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-amber-400" />
                  <p className="text-sm font-medium text-white">Keyword analysis</p>
                </div>

                {analysis.keyword_analysis.matched.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-xs text-slate-500">Matched keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyword_analysis.matched.map((kw) => (
                        <span key={kw} className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-300">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(analysis.keyword_analysis.missing.length > 0 || analysis.missing_skills.length > 0) && (
                  <div>
                    <p className="mb-2 text-xs text-slate-500">Consider adding</p>
                    <div className="flex flex-wrap gap-2">
                      {[...analysis.keyword_analysis.missing, ...analysis.missing_skills].map((kw, i) => (
                        <span key={`${kw}-${i}`} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5 disabled:opacity-60"
              >
                {running ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Re-analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" /> Re-run analysis
                  </>
                )}
              </button>
              <a
                href="/logout"
                className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
              >
                logout
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
