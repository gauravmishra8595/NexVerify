// Question types - mirrors the backend AssessmentSession shape.
// The `answer` field is deliberately absent: the backend never sends
// correct answers to the client. Grading is entirely server-side.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type AssessmentType = "DSA" | "APTITUDE";

export interface Question {
  id: number;
  question: string;
  options: string[];
  difficulty: Difficulty;
}

export interface QuestionSession {
  id: number;
  assessment_type: AssessmentType;
  questions: Question[];
  time_limit_seconds: number;
  created_at: string;
}

export interface SubmittedAnswer {
  question_id: number;
  selected_option: string;
}
