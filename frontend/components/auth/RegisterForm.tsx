"use client";

import { useState } from "react";
import { registerUser } from "@/services/auth";
import AuthShell from "@/components/ui-custom/AuthShell";
import { TextField, PasswordField, ErrorBanner, SubmitButton } from "@/components/ui-custom/FormField";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!PASSWORD_REGEX.test(form.password)) {
      setError(
        "Password needs at least 8 characters, one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      window.location.href = "/login";
    } catch (err: any) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const firstError = Object.values(data)[0];
        const message = Array.isArray(firstError) ? firstError[0] : firstError;
        setError(typeof message === "string" ? message : "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Get verified, take assessments, build your certificate"
      footer={
        <>
          Already have an account?{" "}
          <a href="/login" className="text-amber-400 hover:underline">
            Sign in
          </a>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <ErrorBanner message={error} />}

        <TextField
          label="username"
          type="text"
          name="username"
          placeholder="enteryourUsernamewithoutspace"
          value={form.username}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />

      
        <PasswordField
          label="Password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <p className="mb-5 text-xs text-slate-500">
          8+ chars · uppercase · lowercase · number · special character
        </p>

        <SubmitButton loading={loading} loadingLabel="Creating account...">
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
