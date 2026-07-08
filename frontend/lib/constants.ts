// Application-wide constants

export const API_BASE_URL = "http://127.0.0.1:8000/api";

export const APP_NAME = "VerifyXY";
export const APP_TAGLINE = "Verify Skills. Verify Identity. Hire Better.";

export const ASSESSMENT_DSA_QUESTIONS = 25;
export const ASSESSMENT_APTITUDE_QUESTIONS = 25;
export const ASSESSMENT_DSA_TIME_SECONDS = 1500;    // 25 minutes
export const ASSESSMENT_APTITUDE_TIME_SECONDS = 750; // 12.5 minutes
export const MARKS_PER_QUESTION = 2;                 // 2 marks per correct answer
export const ASSESSMENT_DSA_MAX_SCORE = 50;          // 25 questions × 2 marks
export const ASSESSMENT_APTITUDE_MAX_SCORE = 50;     // 25 questions × 2 marks
export const ASSESSMENT_TOTAL_MAX_SCORE = 100;       // DSA + Aptitude combined

export const RESUME_MAX_SIZE_MB = 5;
export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  DSA: "/assessment/dsa",
  APTITUDE: "/assessment/aptitude",
  RESULT: "/result",
  RESUME: "/resume",
  ANALYSIS: "/analysis",
  ADMIN_LOGIN: "/admin/login",
  ADMIN: "/admin",
  ADMIN_CANDIDATES: "/admin/candidates",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
} as const;
