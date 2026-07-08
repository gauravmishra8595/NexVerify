"use client";

import { Check } from "lucide-react";
import type { Question } from "@/types/questions";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-amber-500/10 text-amber-400",
  Medium: "bg-orange-500/10 text-orange-400",
  Hard: "bg-red-500/10 text-red-400",
};

/**
 * Renders a single quiz question with lettered option cards.
 * Stateless — selection state is owned by the parent quiz component.
 */
export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-6 sm:p-8">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-[family-name:--font-geist-mono] text-xs text-slate-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            DIFFICULTY_STYLES[question.difficulty] ?? DIFFICULTY_STYLES.Medium
          }`}
        >
          {question.difficulty}
        </span>
      </div>

      <h2 className="mb-6 text-lg font-medium leading-relaxed text-white">
        {question.question}
      </h2>

      <div className="space-y-2.5">
        {question.options.map((option, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selectedOption === option;

          return (
            <button
              key={option}
              onClick={() => onSelectOption(option)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition ${
                isSelected
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-white/10 bg-[#111827] hover:border-white/20"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  isSelected
                    ? "bg-amber-500 text-[#111827]"
                    : "bg-white/10 text-slate-400"
                }`}
              >
                {isSelected ? <Check className="h-3.5 w-3.5" /> : letter}
              </span>
              <span className="text-sm text-slate-200">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
