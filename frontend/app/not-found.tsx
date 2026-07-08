import { ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111827] p-6">
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
            <ShieldAlert className="h-6 w-6 text-amber-400" />
          </div>
        </div>
        <p className="font-[family-name:--font-geist-mono] text-sm text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-[#111827] hover:bg-amber-400"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
