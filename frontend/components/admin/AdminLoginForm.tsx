"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/services/admin";
import { ShieldCheck } from "lucide-react";
import Starfield from "@/components/ui-custom/Starfield";

export default function AdminLoginForm() {
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

      const response = await adminLogin({ email, password });

      localStorage.setItem("admin_access", response.access);
      localStorage.setItem("admin_refresh", response.refresh);
      localStorage.setItem("admin_username", response.username);

      router.push("/admin");
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 403) {
        setError("This account does not have admin access.");
      } else if (status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111827] px-4">
      <Starfield density="sparse" />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1E2640] p-8 shadow-2xl"
      >
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">Admin Console</h1>
            <p className="text-sm text-slate-400">VerifyXY operations access</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@verifyxy.com"
          className="mb-4 w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
        />

        <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mb-6 w-full rounded-lg border border-white/10 bg-[#111827] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          Not an admin?{" "}
          <a href="/login" className="text-amber-400 hover:underline">
            Go to candidate login
          </a>
        </p>
      </form>
    </div>
  );
}
