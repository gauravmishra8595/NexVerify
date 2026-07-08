"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sendEmailOTP, verifyEmailOTP } from "@/services/verify";
import useCurrentUser from "@/hooks/useCurrentUser";
import { Mail, ShieldCheck, Loader2, RefreshCw, Code2, Brain, FileText, BarChart2 } from "lucide-react";
import Starfield from "@/components/ui-custom/Starfield";

function getErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.message || fallback;
}

const NEXT_STEPS = [
  { label: "Verify email", icon: ShieldCheck },
  { label: "DSA assessment", icon: Code2 },
  { label: "Aptitude test", icon: Brain },
  { label: "Resume analysis", icon: FileText },
  { label: "Skill report", icon: BarChart2 },
];

export default function OTPVerification() {
  const router = useRouter();
  const { user, loading: userLoading, refetch } = useCurrentUser();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSentRef = useRef(false);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  // Auto-send OTP as soon as user email is available — no click needed
  useEffect(() => {
    if (!userLoading && user?.email && !autoSentRef.current) {
      autoSentRef.current = true;
      sendOTP(user.email);
    }
  }, [user, userLoading]);

  const startCooldown = (seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async (email?: string) => {
    const target = email || user?.email;
    if (!target) {
      setErrorMsg("Could not load your email. Please refresh.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setSending(true);
    try {
      const res = await sendEmailOTP(target);
      setSuccessMsg(res?.message || `Code sent to ${target}`);
      setOtpSent(true);
      startCooldown(30);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 429) {
        setOtpSent(true); // still show input even if rate-limited
        setErrorMsg(getErrorMessage(error, "Please wait before requesting another code."));
      } else {
        setErrorMsg(getErrorMessage(error, "Failed to send OTP. Please try again."));
      }
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!user?.email) return;
    if (otp.length !== 6) {
      setErrorMsg("Please enter the full 6-digit code.");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setVerifying(true);
    try {
      await verifyEmailOTP(user.email, otp);
      await refetch();
      setSuccessMsg("Email verified! Taking you to your assessment\u2026");
      setTimeout(() => router.push("/assessment/dsa"), 1000);
    } catch (error: any) {
      setErrorMsg(getErrorMessage(error, "Invalid code. Please try again."));
    } finally {
      setVerifying(false);
    }
  };

  if (userLoading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111827]">
        <Starfield density="sparse" />
        <Loader2 className="relative h-8 w-8 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111827] px-4 py-12">
      <Starfield density="sparse" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-[80px]"
      />

      <div className="relative w-full max-w-md">
        <a href="/" className="mb-8 flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5 text-amber-400" />
          <span className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
            VerifyXY
          </span>
        </a>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                <ShieldCheck className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-white">Verify your identity</h1>
            <p className="mt-1.5 text-sm text-slate-400">
              A 6-digit code has been sent to your email
            </p>
          </div>

          {/* Email display */}
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#111827] px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-amber-400" />
            <span className="truncate text-sm font-medium text-slate-200">
              {user?.email || "Loading\u2026"}
            </span>
            {sending && <Loader2 className="ml-auto h-4 w-4 shrink-0 animate-spin text-slate-500" />}
          </div>

          {/* Status messages */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
              {successMsg}
            </div>
          )}

          {otpSent && (
            <>
              {/* OTP input */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Enter 6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="· · · · · ·"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full rounded-xl border border-white/10 bg-[#111827] py-4 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10"
                />
              </div>

              {/* Verify button */}
              <button
                onClick={verifyOTP}
                disabled={verifying || otp.length !== 6}
                className="mb-3 w-full rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-[#111827] transition hover:bg-amber-400 disabled:opacity-50"
              >
                {verifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                  </span>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              {/* Resend */}
              <button
                onClick={() => sendOTP()}
                disabled={sending || cooldown > 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </>
          )}

          {!otpSent && !sending && (
            <button
              onClick={() => sendOTP()}
              className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-semibold text-[#111827] transition hover:bg-amber-400"
            >
              Send verification code
            </button>
          )}
        </div>

        {/* Pipeline preview */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#1E2640]/60 p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">
            What&apos;s next
          </p>
          <div className="space-y-1">
            {NEXT_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isFirst = i === 0;
              return (
                <div
                  key={step.label}
                  className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${
                    isFirst ? "text-amber-300" : "text-slate-500"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          OTP verification is required on every login to keep your assessment secure.
        </p>
      </div>
    </div>
  );
}
