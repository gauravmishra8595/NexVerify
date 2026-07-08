import api from "./api";
import type { LoginPayload, LoginResponse, RegisterPayload } from "@/types/auth";

export const registerUser = async (data: RegisterPayload) => {
  const response = await api.post("/accounts/register/", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login/", data);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/accounts/me/");
  return response.data;
};
