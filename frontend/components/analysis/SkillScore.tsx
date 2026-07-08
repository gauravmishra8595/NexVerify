"use client";

interface SkillScoreProps {
  label: string;
  score: number;
  maxScore?: number;
}

/**
 * A single score bar used in the analysis page breakdown.
 * Shows label, numeric score, and a filled progress bar.
 */
export default function SkillScore({ label, score, maxScore = 100 }: SkillScoreProps) {
  const pct = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;

  const barColor =
    pct >= 75 ? "bg-amber-500" : pct >= 50 ? "bg-amber-500/60" : "bg-red-500/60";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="font-[family-name:--font-geist-mono] text-sm font-medium text-white">
          {score}
          <span className="text-xs text-slate-500">/{maxScore}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div
          className={`h-1.5 rounded-full transition-all ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
