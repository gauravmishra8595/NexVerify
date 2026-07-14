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

    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      // JWTs are stored in localStorage so the axios interceptor
      // (services/api.ts) can attach them to every request.
      // User profile data comes from /api/accounts/me/ not from localStorage.
      localStorage.setItem("access", response.access);
      localStorage.setItem("refresh", response.refresh);

      router.push("/dashboard");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
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
