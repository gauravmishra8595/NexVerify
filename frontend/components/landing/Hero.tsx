"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

type StepState = "pending" | "active" | "done";

const STEPS = [
  { label: "Identity verified", sub: "Email OTP confirmed" },
  { label: "DSA assessment", sub: "25 questions · 87% score" },
  { label: "Aptitude assessment", sub: "25 questions · 91% score" },
  { label: "Resume analyzed", sub: "ATS score 84/100" },
];

function useTicketAnimation() {
  const [states, setStates] = useState<StepState[]>(STEPS.map(() => "pending"));

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        for (let i = 0; i < STEPS.length; i++) {
          if (cancelled) return;
          setStates((prev) => prev.map((s, idx) => (idx === i ? "active" : s)));
          await new Promise((r) => setTimeout(r, 700));
          if (cancelled) return;
          setStates((prev) => prev.map((s, idx) => (idx === i ? "done" : s)));
          await new Promise((r) => setTimeout(r, 250));
        }
        await new Promise((r) => setTimeout(r, 1600));
        if (cancelled) return;
        setStates(STEPS.map(() => "pending"));
        await new Promise((r) => setTimeout(r, 500));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return states;
}

function VerificationTicket() {
  const states = useTicketAnimation();
  const allDone = states.every((s) => s === "done");

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1E2640]/80 p-6 shadow-[0_0_60px_-15px_rgba(245,158,11,0.25)] backdrop-blur-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">Candidate</p>
          <p className="font-[family-name:--font-geist-sans] text-base font-semibold text-white">
            RITIK MISHRA
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
            allDone ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/8 text-amber-400"
          }`}
        >
    
        </span>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const state = states[i];
          return (
            <div key={step.label} className="flex items-center gap-3">
              {state === "done" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-400" />
              ) : state === "active" ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-amber-400" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-slate-600" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm transition-colors ${
                    state === "pending" ? "text-slate-500" : "text-slate-200"
                  }`}
                >
                  {step.label}
                </p>
                {state === "done" && (
                  <p className="font-[family-name:--font-geist-mono] text-[11px] text-slate-500">
                    {step.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="font-[family-name:--font-geist-mono] text-[11px] text-slate-500">
          Score: 88
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-36">
      {/* Ambient glow - the one bold accent, used once */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-[80px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Built for hiring teams who need proof, not promises
          </div>

          <h1 className="font-[family-name:--font-geist-sans] text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Verify Skills.
            <br />
            Verify Identity.
            <br />
            <span className="text-amber-400">Hire Better.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-400">
            Every candidate on NexVerify proves who they are, takes a
            real assessment, and gets a detailed skill report with
            ATS analysis and improvement suggestions.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="/register"
              className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#111827] transition hover:bg-amber-400"
            >
              Start verifying for free
            </a>
            <a
              href="/login"
              className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              Sign in
            </a>
          </div>

          <p className="mt-6 font-[family-name:--font-geist-mono] text-xs text-slate-500">
            No credit card · Verification in under 2 minutes
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <VerificationTicket />
        </div>
      </div>
    </section>
  );
}
