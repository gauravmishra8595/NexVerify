"use client";

interface ResumeScoreProps {
  score: number;
  label?: string;
}

/**
 * A circular score ring for displaying the ATS / overall resume score.
 * Uses an SVG stroke-dasharray technique — no charting library needed.
 */
export default function ResumeScore({ score, label = "ATS Score" }: ResumeScoreProps) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const color = score >= 75 ? "#F5B843" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="55" cy="55" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text
          x="55" y="55"
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="20"
          fontWeight="600"
          fontFamily="var(--font-geist-mono)"
        >
          {score}
        </text>
      </svg>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}
