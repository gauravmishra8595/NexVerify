import api from "./api";
import type { Resume } from "@/types/resume";

export const uploadResume = async (file: File): Promise<Resume> => {
  const formData = new FormData();
  formData.append("file", file);

  // The shared `api` instance defaults to "Content-Type: application/json".
  // That default would otherwise stick and break the multipart boundary,
  // so it must be explicitly cleared here for axios to set the correct
  // "multipart/form-data; boundary=..." header itself.
  const response = await api.post<Resume>("/resume/upload/", formData, {
    headers: { "Content-Type": undefined },
  });

  return response.data;
};

export const fetchMyResume = async (): Promise<Resume> => {
  const response = await api.get<Resume>("/resume/me/");
  return response.data;
};
