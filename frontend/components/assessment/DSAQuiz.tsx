"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  generateDSAQuestions,
  preloadAptitudeQuestions,
  submitAssessment,
} from "@/services/assessment";
import type { AssessmentSession, SubmitAnswer } from "@/types/assessment";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, Zap } from "lucide-react";
import Starfield from "@/components/ui-custom/Starfield";
import Timer from "@/components/assessment/Timer";
import QuestionCard from "@/components/assessment/QuestionCard";
import QuestionPalette from "@/components/assessment/QuestionPalette";

export default function DSAQuiz() {
  const router = useRouter();
  const [session, setSession] = useState<AssessmentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1500);
  const [showConfirm, setShowConfirm] = useState(false);
  const hasFinished = useRef(false);
  const preloaded = useRef(false);

 useEffect(() => {
  let cancelled = false;

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);

    // Try 3 times
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const s = await generateDSAQuestions();

        if (cancelled) return;

        setSession(s);
        setTimeLeft(s.time_limit_seconds);
        setLoading(false);
        return;
      } catch (err: any) {
        console.log("Attempt", attempt, err);

        // Authentication error
        if (err?.response?.status === 401) {
          setError("Please login again.");
          setLoading(false);
          return;
        }

        // Email not verified
        if (err?.response?.status === 403) {
          setError("Please verify your email before the assessment.");
          setLoading(false);
          return;
        }

        // Wait before retry
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      }
    }

    if (!cancelled) {
      setError(
        "Server is waking up. Please wait a few seconds and try again."
      );
      setLoading(false);
    }
  };

  loadQuestions();

  return () => {
    cancelled = true;
  };
}, []);

  const triggerPreload = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    preloadAptitudeQuestions().catch(() => {});
  };

  const finish = async (finalAnswers: Record<number, string>) => {
    if (!session || hasFinished.current) return;
    hasFinished.current = true;
    setSubmitting(true);
    const payload: SubmitAnswer[] = session.questions.map((q) => ({
      question_id: q.id,
      selected_option: finalAnswers[q.id] ?? "",
    }));
    try {
      await submitAssessment(session.id, payload);
      router.push("/assessment/aptitude");
    } catch {
      setError("Submit failed. Please try again.");
      hasFinished.current = false;
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(t);
          finish(answers);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const q = session?.questions[currentQ];
  const selected = q ? answers[q.id] ?? "" : "";
  const isLast = session ? currentQ === session.questions.length - 1 : false;
  const answered = Object.keys(answers).length;
  const answeredIds = new Set(Object.keys(answers).map(Number));
  const questionIds = session?.questions.map((qq) => qq.id) ?? [];

  const selectOpt = (opt: string) => {
    if (!q) return;
    setAnswers((p) => ({ ...p, [q.id]: opt }));
    triggerPreload();
  };

  if (loading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#111827] px-6">
        <Starfield density="sparse" />
        <Loader2 className="relative h-10 w-10 animate-spin text-amber-400" />
        <p className="relative mt-5 font-medium text-white">Generating 25 DSA questions&hellip;</p>
        <p className="relative mt-1 text-sm text-slate-500">Fresh questions every attempt &middot; usually 10&ndash;20 sec</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111827] p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1E2640] p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-9 w-9 text-red-400" />
          <p className="mb-5 text-sm text-slate-300">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-amber-400"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!session || !q) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#111827]">
      <Starfield density="sparse" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/6 blur-[80px]"
      />

      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#111827]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="font-[family-name:--font-geist-sans] text-sm font-semibold text-white">
                DSA Assessment
              </p>
              <p className="text-[11px] text-slate-500">
                {answered}/{session.questions.length} answered &middot; 2 marks each
              </p>
            </div>
          </div>
          <Timer secondsLeft={timeLeft} totalSeconds={session.time_limit_seconds} />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-6">
        <div className="mb-5">
          <QuestionPalette
            totalQuestions={session.questions.length}
            currentIndex={currentQ}
            answeredIds={answeredIds}
            questionIds={questionIds}
            onJump={setCurrentQ}
          />
        </div>

        <QuestionCard
          question={q}
          questionNumber={currentQ + 1}
          totalQuestions={session.questions.length}
          selectedOption={selected}
          onSelectOption={selectOpt}
        />

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentQ((p) => Math.max(0, p - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:text-white disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={submitting || answered === 0}
              className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm font-medium text-amber-300 transition hover:bg-amber-500/10 disabled:opacity-40"
            >
              Submit quiz
            </button>
            <button
              onClick={() => (isLast ? finish(answers) : setCurrentQ((p) => p + 1))}
              disabled={!selected || submitting}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-amber-400 disabled:opacity-50"
            >
              {submitting ? "Submitting\u2026" : isLast ? "Finish DSA" : "Next"}
              {!submitting && !isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1E2640] p-7 shadow-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Submit DSA quiz?</h3>
            <p className="mb-6 text-sm text-slate-400">
              You&apos;ve answered <span className="text-slate-200">{answered}</span> of{" "}
              <span className="text-slate-200">{session.questions.length}</span> questions.
              Unanswered questions score zero.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
              >
                Keep going
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  finish(answers);
                }}
                disabled={submitting}
                className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-[#111827] transition hover:bg-amber-400 disabled:opacity-60"
              >
                Yes, submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
