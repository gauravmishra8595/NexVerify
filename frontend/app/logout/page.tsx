// app/logout/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any stored auth data
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/login"); // or "/"
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1E2640] p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-amber-400" />

        <h1 className="text-3xl font-semibold text-white">
          Thank You!
        </h1>

        <p className="mt-4 text-slate-300">
          You have been logged out successfully.
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Thank you for using our AI Resume Analyzer. We look forward to seeing you again!
        </p>

        <div className="mt-8">
          <Link
            href="/login"
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-amber-400"
          >
            Go to Login
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Redirecting automatically...
        </p>
      </div>
    </div>
  );
}