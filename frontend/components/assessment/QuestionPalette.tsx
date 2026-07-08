"use client";

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIds: Set<number>;
  questionIds: number[];
  onJump: (index: number) => void;
}

/**
 * A dot-strip palette showing answered/current/unanswered question status.
 * Clicking any dot jumps to that question — extracted from DSAQuiz/AptitudeQuiz
 * into a standalone component for reuse.
 */
export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIds,
  questionIds,
  onJump,
}: QuestionPaletteProps) {
  return (
    <div className="flex gap-1.5" role="navigation" aria-label="Question navigation">
      {Array.from({ length: totalQuestions }).map((_, i) => {
        const qid = questionIds[i];
        const isAnswered = answeredIds.has(qid);
        const isCurrent = i === currentIndex;

        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            aria-label={`Question ${i + 1}${isAnswered ? " (answered)" : ""}${isCurrent ? " (current)" : ""}`}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isCurrent
                ? "bg-amber-400"
                : isAnswered
                ? "bg-amber-500/40"
                : "bg-white/10"
            }`}
          />
        );
      })}
    </div>
  );
}
