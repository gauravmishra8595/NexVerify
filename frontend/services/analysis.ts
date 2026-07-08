import api from "./api";
import type { CandidateAnalysis } from "@/types/analysis";

export const runResumeAnalysis = async (): Promise<CandidateAnalysis> => {
  const response = await api.post<CandidateAnalysis>("/analysis/run/");
  return response.data;
};

export const fetchMyLatestAnalysis = async (): Promise<CandidateAnalysis> => {
  const response = await api.get<CandidateAnalysis>("/analysis/me/");
  return response.data;
};
