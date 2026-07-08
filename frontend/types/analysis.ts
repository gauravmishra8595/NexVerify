export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
}

export interface CandidateAnalysis {
  id: number;
  resume: number;
  ats_score: number;
  grammar_score: number;
  skill_match_score: number;
  project_quality_score: number;
  experience_score: number;
  project_score: number;
  overall_score: number;
  recommendation: string;
  strengths: string[];
  improvements: string[];
  missing_skills: string[];
  keyword_analysis: KeywordAnalysis;
  created_at: string;
}
