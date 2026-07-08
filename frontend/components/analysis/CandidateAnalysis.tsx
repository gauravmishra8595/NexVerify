"use client";

import SkillScore from "./SkillScore";
import FeedbackCard from "./FeedbackCard";
import type { CandidateAnalysis as CandidateAnalysisType } from "@/types/analysis";

interface CandidateAnalysisProps {
  analysis: CandidateAnalysisType;
}

/**
 * Condensed analysis summary — shows all six sub-scores and feedback
 * lists without the recharts charts. Used where a lightweight summary
 * is needed (e.g. a candidate profile panel or the admin detail view).
 * For the full charts version, see components/analysis/AnalysisResult.tsx.
 */
export default function CandidateAnalysis({ analysis }: CandidateAnalysisProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <SkillScore label="ATS Score" score={analysis.ats_score} />
        <SkillScore label="Grammar" score={analysis.grammar_score} />
        <SkillScore label="Skill Match" score={analysis.skill_match_score} />
        <SkillScore label="Project Quality" score={analysis.project_quality_score} />
        <SkillScore label="Experience" score={analysis.experience_score} />
        <SkillScore label="Projects" score={analysis.project_score} />
      </div>

      {analysis.recommendation && (
        <p className="text-sm leading-relaxed text-slate-400">{analysis.recommendation}</p>
      )}

      <FeedbackCard title="Strengths" items={analysis.strengths} tone="positive" />
      <FeedbackCard title="Improvements" items={analysis.improvements} tone="warning" />
      <FeedbackCard
        title="Missing skills"
        items={[...analysis.missing_skills, ...analysis.keyword_analysis.missing]}
        tone="neutral"
      />
    </div>
  );
}
