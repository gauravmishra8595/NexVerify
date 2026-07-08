import api from "./api";
import type {
  AssessmentResultData,
  AssessmentSession,
  SubmitAnswer,
  SubmitAssessmentResponse,
} from "@/types/assessment";

export const generateDSAQuestions = async (): Promise<AssessmentSession> => {
  const response = await api.get<AssessmentSession>("/assessment/generate/dsa/");
  return response.data;
};

export const generateAptitudeQuestions = async (): Promise<AssessmentSession> => {
  const response = await api.get<AssessmentSession>("/assessment/generate/aptitude/");
  return response.data;
};

export const preloadAptitudeQuestions = async (): Promise<AssessmentSession> => {
  // Silently pre-generates the aptitude session in the background while
  // the candidate is still on the DSA quiz. When they arrive at the
  // aptitude page, the session is already in the DB so it loads instantly.
  const response = await api.get<AssessmentSession>("/assessment/preload/aptitude/");
  return response.data;
};

export const submitAssessment = async (
  sessionId: number,
  answers: SubmitAnswer[]
): Promise<SubmitAssessmentResponse> => {
  const response = await api.post<SubmitAssessmentResponse>("/assessment/submit/", {
    session_id: sessionId,
    answers,
  });
  return response.data;
};

export const fetchMyLatestResult = async (): Promise<AssessmentResultData> => {
  const response = await api.get<AssessmentResultData>("/assessment/results/me/");
  return response.data;
};
