"use client";

/**
 * Reusable OTP input form — 6-digit numeric code entry.
 * Used by OTPVerification; extracted here so it can be reused
 * anywhere else that needs a code input (e.g. a future password-reset flow).
 */

interface OTPFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  loading: boolean;
  cooldown: number;
  submitLabel?: string;
}

export default function OTPForm({
  value,
  onChange,
  onSubmit,
  onResend,
  loading,
  cooldown,
  submitLabel = "Verify",
}: OTPFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-slate-400">
          Enter 6-digit code
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="······"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          className="w-full rounded-lg border border-white/10 bg-[#111827] py-3 text-center font-[family-name:--font-geist-mono] text-lg tracking-[0.5em] text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || value.length !== 6}
        className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-medium text-[#111827] transition hover:bg-amber-400 disabled:opacity-60"
      >
        {loading ? "Verifying..." : submitLabel}
      </button>

      <button
        onClick={onResend}
        disabled={loading || cooldown > 0}
        className="w-full rounded-lg border border-white/10 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
      >
        {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
      </button>
    </div>
  );
}
