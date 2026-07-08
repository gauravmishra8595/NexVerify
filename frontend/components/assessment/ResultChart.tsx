"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ResultChartProps {
  dsaScore: number;
  aptitudeScore: number;
  maxScore?: number;
}

/**
 * Simple bar chart comparing DSA and Aptitude scores.
 * Used on the /result page summary.
 * Requires recharts: npm install recharts
 */
export default function ResultChart({ dsaScore, aptitudeScore, maxScore = 50 }: ResultChartProps) {
  const data = [
    { name: "DSA", score: dsaScore, max: maxScore },
    { name: "Aptitude", score: aptitudeScore, max: maxScore },
  ];

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#64748B", fontSize: 12 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          domain={[0, maxScore]}
          tick={{ fill: "#64748B", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#1E2640",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#F5B843" }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="score" fill="#F5B843" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
