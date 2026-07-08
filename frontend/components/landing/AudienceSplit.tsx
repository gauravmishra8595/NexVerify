import { CheckCircle2 } from "lucide-react";

const RECRUITER_POINTS = [
  "Skip phone screens for basic skill checks",
  "Compare candidates on identical, freshly-generated tests",
  "Export candidate data and scores as CSV",
  "Verify identity before you ever schedule a call",
];

const CANDIDATE_POINTS = [
  "Prove your skills with a test that isn't reused or leaked",
  "Get an honest ATS score before you apply anywhere",
  "Know exactly what to improve before your next application",
  "Get a detailed ATS resume score with actionable feedback",
];

function AudienceCard({
  eyebrow,
  title,
  points,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  points: string[];
  cta: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1E2640] p-8">
      <p className="mb-2 font-[family-name:--font-geist-mono] text-xs uppercase tracking-wider text-amber-400">
        {eyebrow}
      </p>
      <h3 className="mb-6 text-2xl font-semibold text-white">{title}</h3>

      <ul className="mb-8 space-y-3">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2.5 text-sm text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            {point}
          </li>
        ))}
      </ul>

      <a
        href={href}
        className="inline-flex rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:border-amber-500/40 hover:bg-amber-500/5"
      >
        {cta}
      </a>
    </div>
  );
}

export default function AudienceSplit() {
  return (
    <section className="border-t border-white/10 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2">
          <AudienceCard
            eyebrow="For hiring teams"
            title="Stop guessing who's actually qualified"
            points={RECRUITER_POINTS}
            cta="Try it yourself"
            href="/register"
          />
          <AudienceCard
            eyebrow="For candidates"
            title="Build proof that travels with you"
            points={CANDIDATE_POINTS}
            cta="Start your verification"
            href="/register"
          />
        </div>
      </div>
    </section>
  );
}
