"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

function generateStars(count: number, seed: number): Star[] {
  // Simple deterministic pseudo-random so server and client render the
  // same star field (avoids hydration mismatches from Math.random()).
  let value = seed;
  const next = () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${(next() * 100).toFixed(2)}%`,
    left: `${(next() * 100).toFixed(2)}%`,
    size: 1 + Math.floor(next() * 2),
    delay: `${(next() * 4).toFixed(2)}s`,
    duration: `${(2.5 + next() * 3).toFixed(2)}s`,
    opacity: 0.3 + next() * 0.6,
  }));
}

/**
 * Ambient twinkling starfield background. Pure CSS animation (no canvas,
 * no JS animation loop) so it stays cheap even on pages with a lot of
 * other content. Renders behind everything via absolute positioning -
 * the parent must be `relative` and have `overflow-hidden`.
 */
export default function Starfield({ density = "normal" }: { density?: "sparse" | "normal" | "dense" }) {
  const count = density === "sparse" ? 60 : density === "dense" ? 160 : 100;
  const stars = useMemo(() => generateStars(count, 42), [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
