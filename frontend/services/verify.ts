import api from "./api";
import type { SendOTPResponse, VerifyOTPResponse } from "@/types/otp";

export const sendEmailOTP = async (email: string): Promise<SendOTPResponse> => {
  const response = await api.post<SendOTPResponse>("/verify/email/send/", { email });
  return response.data;
};

export const verifyEmailOTP = async (
  email: string,
  otp: string
): Promise<VerifyOTPResponse> => {
  const response = await api.post<VerifyOTPResponse>("/verify/email/check/", { email, otp });
  return response.data;
};
