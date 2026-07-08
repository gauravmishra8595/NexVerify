"use client";

import { Clock } from "lucide-react";

interface TimerProps {
  secondsLeft: number;
  totalSeconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Standalone timer pill — reusable across DSA and Aptitude quiz screens.
 * Changes colour from amber → amber → red as time runs out.
 */
export default function Timer({ secondsLeft, totalSeconds }: TimerProps) {
  const pct = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;

  const toneClass =
    pct <= 0.1
      ? "text-red-400 border-red-500/30 bg-red-500/10"
      : pct <= 0.25
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-amber-300 border-amber-500/20 bg-amber-500/5";

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-[family-name:--font-geist-mono] transition-colors ${toneClass}`}
      aria-label={`Time remaining: ${formatTime(secondsLeft)}`}
    >
      <Clock className="h-3.5 w-3.5" aria-hidden />
      {formatTime(secondsLeft)}
    </div>
  );
}
