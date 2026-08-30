// Skeleton shown while the program page streams — indigo hero with stat tiles +
// the applicant table placeholder.
export default function Loading() {
  return (
    <main className="animate-pulse" aria-hidden="true">
      <section
        className="px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-6 lg:px-12"
        style={{ background: "var(--hero-bg)" }}
      >
        <div className="mx-auto max-w-180">
          <div className="h-3 w-48 rounded bg-white/20" />
          <div className="mt-4 h-6 w-20 rounded-full bg-white/15" />
          <div className="mt-3 h-7 w-3/4 rounded bg-white/25 sm:h-9" />
          <div className="mt-1 h-3 w-1/2 rounded bg-white/15" />
          <div className="mt-5 flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 w-20 rounded-sm bg-white/10" />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-180 px-5 pb-16 pt-7 sm:px-8 lg:px-12">
        <div className="mb-4 h-10 rounded-lg border border-border bg-surface" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg border border-border bg-surface" />
          ))}
        </div>
      </div>
    </main>
  );
}
