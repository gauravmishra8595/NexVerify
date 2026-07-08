"use client";

interface FeedbackCardProps {
  title: string;
  items: string[];
  tone?: "positive" | "warning" | "neutral";
}

const TONE_STYLES = {
  positive: "border-amber-500/20 bg-amber-500/5",
  warning: "border-red-500/20 bg-red-500/5",
  neutral: "border-white/10 bg-[#1E2640]",
};

const BULLET_COLORS = {
  positive: "text-amber-400",
  warning: "text-red-400",
  neutral: "text-slate-400",
};

/**
 * A card displaying a list of feedback items (strengths, improvements,
 * missing skills) from the AI resume analysis.
 */
export default function FeedbackCard({
  title,
  items,
  tone = "neutral",
}: FeedbackCardProps) {
  if (items.length === 0) return null;

  return (
    <div className={`rounded-2xl border p-6 ${TONE_STYLES[tone]}`}>
      <p className="mb-3 text-sm font-medium text-white">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${BULLET_COLORS[tone]}`}>
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
