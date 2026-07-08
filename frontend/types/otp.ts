export interface SendOTPResponse {
  message: string;
}

export interface VerifyOTPResponse {
  message: string;
  code?: string;
}

export interface OTPErrorResponse {
  message: string;
  code?:
    | "not_found"
    | "already_used"
    | "expired"
    | "too_many_attempts"
    | "invalid_otp";
}
