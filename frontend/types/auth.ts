export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  is_email_verified: boolean;
  role: "USER" | "ADMIN";
}
