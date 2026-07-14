export interface AdminLoginPayload {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  access: string;
  refresh: string;
  username: string;
  email: string;
}

export interface Candidate {
  id: number;
  username: string;
  email: string;
  is_email_verified: boolean;
  is_active: boolean;
  role: string;
  date_joined: string;
  latest_total_score: number | null;
}

export interface AssessmentResultEntry {
  id: number;
  dsa_score: number;
  aptitude_score: number;
  total_score: number;
  created_at: string;
}

export interface CandidateDetail extends Omit<Candidate, "latest_total_score"> {
  last_login: string | null;
  assessment_results: AssessmentResultEntry[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AnalyticsSummary {
  total_candidates: number;
  verified_email_count: number;
  suspended_count: number;
  total_assessments_taken: number;
  average_total_score: number | null;
  new_candidates_last_7_days: number;
}

export interface NotificationLogEntry {
  id: number;
  channel: "EMAIL";
  destination: string;
  status: "SENT" | "FAILED";
  error_message: string;
  created_at: string;
}

export type VerifiedFilter = "all" | "email" | "none";
export type ActiveFilter = "all" | "true" | "false";
