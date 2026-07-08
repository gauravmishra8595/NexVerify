"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How is identity actually verified?",
    a: "Candidates confirm a one-time code sent to their email address before they can start any assessment. This blocks duplicate accounts and proxy test-taking at the source.",
  },
  {
    q: "Are the DSA and aptitude questions reused?",
    a: "No. Questions are generated per attempt across topics like arrays, trees, graphs, dynamic programming, and logical reasoning, so no two attempts look identical.",
  },
  {
    q: "What does the AI resume analysis actually check?",
    a: "It extracts skills, education, experience, and projects from the uploaded resume, then scores ATS-readiness, keyword match against common job descriptions, and overall project quality — with specific suggestions for improvement.",
  },
  {
    q: "Do I need a credit card to try it as a candidate?",
    a: "No. Verification, assessments, and resume analysis are completely free.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 font-[family-name:--font-geist-mono] text-xs uppercase tracking-wider text-amber-400">
            FAQ
          </p>
          <h2 className="font-[family-name:--font-geist-sans] text-3xl font-semibold tracking-tight text-white">
            Questions, answered
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-white/10 bg-[#1E2640] px-5"
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-white"
                >
                  {item.q}
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <p className="pb-4 text-sm leading-relaxed text-slate-400">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
