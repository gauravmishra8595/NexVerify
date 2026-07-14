"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth";
import AuthShell from "@/components/ui-custom/AuthShell";
import { TextField, PasswordField, ErrorBanner, SubmitButton } from "@/components/ui-custom/FormField";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError(null);

  // Client-side validation
  if (!email.trim()) {
    setError("Email is required.");
    return;
  }

  if (!password.trim()) {
    setError("Password is required.");
    return;
  }

  try {
    setLoading(true);

    const response = await loginUser({
      email: email.trim(),
      password,
    });

    localStorage.setItem("access", response.access);
    localStorage.setItem("refresh", response.refresh);

    router.push("/dashboard");
  } catch (err: any) {
    console.error("Login Error:", err);

    // No response means network error
    if (!err.response) {
      setError("Unable to connect to the server. Please check your internet connection.");
      return;
    }

    const { status, data } = err.response;

    switch (status) {
      case 400:
        setError(
          data?.detail ||
            data?.message ||
            "Please enter a valid email and password."
        );
        break;

      case 401:
        setError("Invalid email or password.");
        break;

      case 403:
        setError("Your account is not allowed to sign in.");
        break;

      case 404:
        setError("Account not found.");
        break;

      case 429:
        setError("Too many login attempts. Please try again later.");
        break;

      case 500:
        setError("Server error. Please try again later.");
        break;

      default:
        setError(
          data?.detail ||
            data?.message ||
            "Something went wrong. Please try again."
        );
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your verification"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-amber-400 hover:underline">
            Create one
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <ErrorBanner message={error} />}

        <TextField
          label="Email"
          type="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="mb-5" />

        <SubmitButton loading={loading} loadingLabel="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </AuthShell>
  );
} 
