export default function FinalCTA() {
  return (
    <section className="border-t border-white/10 px-6 py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] to-transparent p-12 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-amber-500/8 blur-[70px]"
        />
        <h2 className="relative font-[family-name:--font-geist-sans] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Get verified. Get certified. Get hired.
        </h2>
        <p className="relative mx-auto mt-4 max-w-md text-slate-400">
          Two minutes to verify your identity. A few minutes more for a
          detailed skill report with real feedback on your resume.
        </p>
        <a
          href="/register"
          className="relative mt-8 inline-flex rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-[#111827] transition hover:bg-amber-400"
        >
          Start verifying — it's free
        </a>
      </div>
    </section>
  );
}
