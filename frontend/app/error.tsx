"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] p-6">
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-400">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
