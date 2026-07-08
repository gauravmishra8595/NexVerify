export type AssessmentType = "DSA" | "APTITUDE";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  difficulty: Difficulty;
  // No "answer" field by design - the backend never sends it to the client.
}

export interface AssessmentSession {
  id: number;
  assessment_type: AssessmentType;
  questions: AssessmentQuestion[];
  time_limit_seconds: number;
  created_at: string;
}

export interface SubmitAnswer {
  question_id: number;
  selected_option: string;
}

export interface AssessmentResultData {
  id: number;
  dsa_score: number;
  aptitude_score: number;
  total_score: number;
  created_at: string;
}

export interface SubmitAssessmentResponse {
  session_id: number;
  assessment_type: AssessmentType;
  score: number;
  total_questions: number;
  result: AssessmentResultData;
}
