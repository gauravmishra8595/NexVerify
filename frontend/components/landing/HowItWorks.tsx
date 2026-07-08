import { ShieldCheck, Brain, FileSearch, Award } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Verify identity",
    body: "Candidates confirm who they are over email OTP before they can touch a single question. No bots, no proxies, no fake accounts.",
  },
  {
    number: "02",
    icon: Brain,
    title: "Take real assessments",
    body: "Fresh DSA and aptitude questions, generated per attempt across arrays, trees, graphs, DP, and reasoning. Timed, scored, never the same test twice.",
  },
  {
    number: "03",
    icon: FileSearch,
    title: "Resume gets analyzed",
    body: "AI extracts skills, projects, and experience from the uploaded resume, then scores ATS-readiness, keyword match, and project quality.",
  },
  {
    number: "04",
    icon: Award,
    title: "View your results",
    body: "See your complete assessment report — DSA score, aptitude score, ATS analysis, skill gaps, and improvement suggestions, all in one place.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-lg">
          <p className="mb-3 font-[family-name:--font-geist-mono] text-xs uppercase tracking-wider text-amber-400">
            The pipeline
          </p>
          <h2 className="font-[family-name:--font-geist-sans] text-3xl font-semibold tracking-tight text-white">
            One sequence. Every candidate goes through all four steps, in order.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="bg-[#111827] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-amber-400" />
                  <span className="font-[family-name:--font-geist-mono] text-xs text-slate-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
