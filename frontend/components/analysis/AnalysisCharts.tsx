"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { CandidateAnalysis } from "@/types/analysis";

const AMBER = "#F5B843";
const AMBER_DIM = "rgba(245, 184, 67, 0.25)";
const SLATE = "#64748B";

function buildRadarData(a: CandidateAnalysis) {
  return [
    { subject: "ATS", score: a.ats_score },
    { subject: "Grammar", score: a.grammar_score },
    { subject: "Skill Match", score: a.skill_match_score },
    { subject: "Project Quality", score: a.project_quality_score },
    { subject: "Experience", score: a.experience_score },
    { subject: "Projects", score: a.project_score },
  ];
}

function buildBarData(a: CandidateAnalysis) {
  return [
    { name: "ATS", score: a.ats_score },
    { name: "Grammar", score: a.grammar_score },
    { name: "Skills", score: a.skill_match_score },
    { name: "Proj. Quality", score: a.project_quality_score },
    { name: "Experience", score: a.experience_score },
    { name: "Projects", score: a.project_score },
  ];
}

function buildPieData(overallScore: number) {
  return [
    { name: "Score", value: overallScore },
    { name: "Remaining", value: 100 - overallScore },
  ];
}

export function RadarScoreChart({ analysis }: { analysis: CandidateAnalysis }) {
  const data = buildRadarData(analysis);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: SLATE, fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fill: SLATE, fontSize: 9 }} axisLine={false} />
        <Radar
          name="Score"
          dataKey="score"
          stroke={AMBER}
          fill={AMBER}
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function BarScoreChart({ analysis }: { analysis: CandidateAnalysis }) {
  const data = buildBarData(analysis);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: SLATE, fontSize: 10 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
        <YAxis domain={[0, 100]} tick={{ fill: SLATE, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "#1E2640",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: AMBER }}
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
        />
        <Bar dataKey="score" fill={AMBER} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OverallPieChart({ overallScore }: { overallScore: number }) {
  const data = buildPieData(overallScore);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={65}
            outerRadius={85}
            startAngle={90}
            endAngle={-270}
            stroke="none"
          >
            <Cell fill={AMBER} />
            <Cell fill={AMBER_DIM} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-[family-name:--font-geist-mono] text-3xl font-semibold text-white">
          {overallScore}
        </span>
        <span className="text-xs text-slate-500">/ 100</span>
      </div>
    </div>
  );
}
