import adminApi from "./adminApi";
import type {
  AdminLoginPayload,
  AdminLoginResponse,
  AnalyticsSummary,
  Candidate,
  CandidateDetail,
  NotificationLogEntry,
  PaginatedResponse,
} from "@/types/admin";

export const adminLogin = async (data: AdminLoginPayload): Promise<AdminLoginResponse> => {
  const response = await adminApi.post<AdminLoginResponse>("/login/", data);
  return response.data;
};

export interface CandidateListParams {
  search?: string;
  verified?: "email" | "none";
  is_active?: "true" | "false";
  page?: number;
}

export const fetchCandidates = async (
  params: CandidateListParams = {}
): Promise<PaginatedResponse<Candidate>> => {
  const response = await adminApi.get<PaginatedResponse<Candidate>>("/candidates/", { params });
  return response.data;
};

export const fetchCandidateDetail = async (id: number): Promise<CandidateDetail> => {
  const response = await adminApi.get<CandidateDetail>(`/candidates/${id}/`);
  return response.data;
};

export const suspendCandidate = async (id: number): Promise<{ id: number; is_active: boolean; message: string }> => {
  const response = await adminApi.post(`/candidates/${id}/suspend/`);
  return response.data;
};

export const deleteCandidate = async (id: number): Promise<{ message: string }> => {
  const response = await adminApi.delete(`/candidates/${id}/delete/`);
  return response.data;
};

export const downloadCandidatesCSV = async (): Promise<void> => {
  // The export endpoint requires admin auth, and browsers don't attach
  // custom Authorization headers to plain <a href> downloads - so we
  // fetch it via the authenticated axios instance and save the blob ourselves.
  const response = await adminApi.get("/candidates/export/", { responseType: "blob" });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = "verifyxy_candidates.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const fetchAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await adminApi.get<AnalyticsSummary>("/analytics/summary/");
  return response.data;
};

export const fetchNotificationLogs = async (params: {
  channel?: string;
  status?: string;
} = {}): Promise<NotificationLogEntry[]> => {
  const response = await adminApi.get<NotificationLogEntry[]>("/notifications/", { params });
  return response.data;
};
